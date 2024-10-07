import { FC, LegacyRef, useEffect, useRef, useState } from "react"

import {
  generatePath,
} from "react-router-dom"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import {
  actions,
  useStore,
  store,
} from "@/store"

import {
  app_routes,
  auth_routes,
  route_attributes,
} from '@/constants/router'

import {
  StationTag,
  QueryLink,
} from '@/components'

import { Slider } from "primereact/slider"

import { InputNumber } from "primereact/inputnumber"

import { icon_classes } from "@/constants/icon_classes"

import { tooltip_options } from "@/constants/tooltip_options"
import { classNames } from "primereact/utils"
import { NumRange } from "@/types/generics/range"

const tltp_options = { ...tooltip_options, position: 'top' } as const

export const Player: FC = () => {

  const current_page = useStore().app.current_page()

  const [audio_ref, set_audio_ref] = useState<HTMLAudioElement | null>(null)

  const playing = useStore().player.playing()

  const volume = useStore().player.volume()

  const current_station = useStore().player.current_station()

  console.log('current_station : ', current_station)

  useEffect(() => {
    actions.player.playing(false)
  }, [])

  useEffect(() => {
    if (current_station && audio_ref) {
      if (playing) {
        audio_ref.src = current_station.external_enable ? current_station.external : ''
        audio_ref.play()
      } else {
        audio_ref.pause()
      }
    }
  }, [playing, current_station])

  useEffect(() => {
    if (audio_ref) {
      audio_ref.volume = volume / 100
    }
  }, [volume, audio_ref])

  const [avatar_not_exists, set_avatar_not_exists] = useState('')

  useEffect(() => {
    if (current_station) {
      set_avatar_not_exists(e => e == current_station.id ? e : '')
    }
  }, [current_station])

  //remove after adding buttons for random station
  return current_station ?
    <div className="flex flex-row flex-shrink-0 shadow-3 h-7rem justify-content-center bg-white p-1 sm:p-2 gap-3 mt-auto">

      <audio
        src=""
        style={{
          display: 'none'
        }}
        ref={e => set_audio_ref(e)}
      />

      <div
        className="player_station_avatar w-4rem h-4rem sm:w-6rem sm:h-6rem shadow-2 bg-no-repeat bg-contain bg-center flex-shrink-0 border-round-xl flex align-items-center justify-content-center"
        style={{ backgroundImage: current_station ? `url(/api/v1/files/stations/${current_station?.id}/avatar)` : '' }}
      >
        {
          current_station ?
            <img
              style={{ display: 'none' }}
              src={`/api/v1/files/stations/${current_station?.id}/avatar`}

              onError={({ currentTarget }) => {
                set_avatar_not_exists(current_station.id)
              }}
            />
            : <></>
        }

        {
          avatar_not_exists == current_station?.id ?
            <i className="pi pi-wave-pulse text-secondary" style={{ fontSize: '4rem' }}></i>
            :
            <></>
        }
      </div>

      <div className="flex flex-column justify-content-between -ml-2 sm:ml-0">

        <Button
          className="shadow_on_hover p-0 flex-shrink-0"

          rounded
          outlined
          raised
          aria-label={`${playing ? 'Pause' : 'Play'}`}
          severity="info"
          icon={`pi text-3xl ${playing ? 'pi-pause' : 'pi-play'}`}

          pt={{
            icon: {
              style: {
                paddingLeft: playing ? '0' : '4px',
              }
            }
          }}

          onClick={() => actions.player.switch_playing()}
        />

        <div className="flex justify-content-between align-items-center text-gray-500 w-4rem">
          {/* volume icon */}
          <Button
            icon={`pi pi-${volume ? 'volume-up' : 'volume-off'}`}
            rounded
            outlined
            raised
            aria-label="volume"
            className={`p-0 w-2rem h-2rem shadow_on_hover`}
            severity={`warning`}

            onClick={() => {
              const v = store.player.volume()
              if (v) {
                actions.player.prev_volume(v)
                actions.player.volume(0)
              } else {
                actions.player.volume(store.player.prev_volume() ?? 100)
              }
            }}
          />

          {volume}

        </div>

      </div>

      <Slider
        value={volume}
        onChange={(e) => {
          actions.player.volume(e.value as NumRange<101>)
        }}
        orientation="vertical"
        className="h-5rem align-self-center -ml-2"
        pt={{
          range: {
            style: {
              backgroundColor: 'var(--color-secondary)',
            }
          },
          handle: {
            className: classNames({},
              'hover:bg-cyan-500'
            ),
            style: {
              borderColor: 'var(--color-secondary)',
            }
          }
        }}
      />

      <div className="flex flex-column w-15rem justify-content-between">

        <div className="player_station">
          {/* current station name */}
          {
            current_station ?
              <QueryLink to={generatePath(app_routes["station$id"], { id: current_station?.id })} className="radio_card_header align-self-center font-semibold text-secondary text_hidden_overflow line-clamp-2 text-center">
                {current_station?.name}
              </QueryLink>
              : <></>
          }
          {/*  likes*/}

          {/* listeners */}
        </div>

        <div className="player_track">
          {/* current artist - track name */}

          {/* likes */}

          {/* downloads  if downloadable */}
        </div>

        <div className="station_tags_container text_hidden_overflow line-clamp-2 max-w-15rem text-center">
          {/* current station tags (clickable, opens the main page with search with clicked tag)  */}
          {
            current_station?.tags.map(tag => <StationTag tag={tag} />)
          }

        </div>

      </div>

      <div className="flex flex-column">
        {/* history button */}

        {/* random station */}

        {/* random with similar tag */}
      </div>

    </div>
    : <></>
}