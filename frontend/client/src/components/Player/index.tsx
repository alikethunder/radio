import { FC, memo, useCallback, useEffect, useState } from "react"

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
} from '@/constants/router'

import {
  StationTag,
  QueryLink,
  AddStationToFavorites,
} from '@/components'

import { Slider } from "primereact/slider"

import { classNames } from "primereact/utils"
import { NumRange } from "@/types/generics/range"
import { useTranslations, useTranslationsSkeleton } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"

import './index.sass'

export const Player: FC = memo(() => {

  const [audio_ref, set_audio_ref] = useState<HTMLAudioElement | null>(null)

  const playing = useStore().player.playing()

  const volume = useStore().player.volume()

  const current_station = useStore().player.current_station()

  const theme = useStore().persistedApp.theme()

  useEffect(() => {
    if (current_station && audio_ref) {
      if (playing) {
        audio_ref.src = current_station?.external_enable ? current_station?.external : ''
        audio_ref.play().catch((e) => {
          console.log('[Player] play error : ', e)
          actions.player.playing(false)
          audio_ref.pause()
        })
      } else {
        audio_ref.pause()
      }
    }
  }, [playing, current_station, audio_ref])

  useEffect(() => {
    if (audio_ref) {
      audio_ref.volume = volume / 100
    }
  }, [volume, audio_ref])

  const [avatar_not_exists, set_avatar_not_exists] = useState('')

  useEffect(() => {
    if (current_station) {
      set_avatar_not_exists(e => e == current_station?.id ? e : '')
    }
  }, [current_station])

  const [translations] = useTranslations([
    'mute',
    'unmute',
    'volume',
    'play',
    'pause',
  ], true)

  const translations_skl = useTranslationsSkeleton({
    'added_to_favorites': ['w-8rem'],
  }, true)

  const switch_playing = useDebounceCallback(() => actions.player.switch_playing(), 50)

  const click_volume_icon = useDebounceCallback(() => {
    const v = store.player.volume()
    if (v) {
      actions.player.prev_volume(v)
      actions.player.volume(0)
    } else {
      actions.player.volume(store.player.prev_volume() ?? 100)
    }
  }, 50)

  const set_audio_ref_func = useCallback((e: HTMLAudioElement) => {
    set_audio_ref(e)
  }, [])

  return (
    <div id="player" className={`flex flex-row flex-shrink-0 shadow-3 h-9rem justify-content-center surface-card p-2 sm:p-2 gap-3 mt-auto ${current_station ? 'opened' : ''}`}>

      <audio
        src=""
        style={{
          display: 'none'
        }}
        ref={set_audio_ref_func}
      />

      <div className="flex flex-row flex-wrap-reverse gap-2 align-items-end justify-content-center">

        <div className="flex flex-column social_info">
          <div className="flex gap-1 flex-column">
            {/* <span className="text-gray-500 favorited">125</span> */}
            <AddStationToFavorites id={current_station?.id} data-targetid="player_add_to_fav" />

            {/* <Tooltip target='.favorited' >
              {translations_skl.added_to_favorites}
            </Tooltip> */}
          </div>
        </div>

        <div
          className="player_station_avatar w-4rem h-4rem sm:w-6rem sm:h-6rem shadow-2 bg-no-repeat bg-contain bg-center flex-shrink-0 border-round-xl flex align-items-center justify-content-center"
          style={{ backgroundImage: current_station ? `url(/api/v1/files/stations/${current_station?.id}/avatar)` : '' }}
        >
          {
            current_station ?
              <img
                style={{ display: 'none' }}
                src={`/api/v1/files/stations/${current_station?.id}/avatar`}
                
                loading="lazy"

                onError={({ currentTarget }) => {
                  set_avatar_not_exists(current_station?.id)
                }}
              />
              : <></>
          }

          {
            avatar_not_exists == current_station?.id ?
              <i className="pi pi-wave-pulse text-primary" style={{ fontSize: '4rem' }}></i>
              :
              <></>
          }
        </div>
      </div>

      <div className="flex flex-column justify-content-between -ml-2 sm:ml-0">

        <Button
          className="shadow_on_hover active_element p-0 flex-shrink-0 hover:text-primary hover:border-primary"

          rounded
          outlined
          raised
          aria-label={`${playing ? translations.pause : translations.play}`}
          severity="info"
          icon={`pi text-3xl ${playing ? 'pi-pause' : 'pi-play'}`}

          pt={{
            root: {
              style: {
                backgroundColor: 'var(--maskbg)',
                borderColor: '#fff',
                color: theme == 'light' ? 'var(--maskbg)' : '#fff',
              }
            },
            icon: {
              style: {
                paddingLeft: playing ? '0' : '4px',
                color: '#fff',
                fontWeight: 600,
              }
            }
          }}

          onClick={switch_playing}
        />

        <div className="flex flex-column justify-content-between align-items-center text-gray-500 gap-1">

          {volume}

          {/* volume icon */}
          <Button
            icon={`pi pi-${volume ? 'volume-up' : 'volume-off text-sm mr-1'}`}
            rounded
            outlined
            raised
            aria-label={volume ? translations.mute : translations.unmute}
            className={`p-0 w-2rem h-2rem shadow_on_hover ${volume ? '' : 'pr-1'}`}
            severity={`warning`}

            onClick={click_volume_icon}
          />
        </div>

      </div>

      <Slider
        value={volume}

        aria-label={translations.volume}

        onChange={(e) => {
          actions.player.volume(e.value as NumRange<101>)
        }}
        orientation="vertical"
        className="h-5rem align-self-center mx-1"
        pt={{
          range: {
            className: classNames({},
              'bg-secondary',
              'shadow_glow',
            ),
            style: {
              color: 'var(--secondary-color)',
            }
          },
          handle: {
            className: classNames({},
              'hover:bg-cyan-500',
              'border-secondary',
              'text-cyan-500',
              'shadow_on_hover',
            ),
          }
        }}
      />

      <div className="flex flex-column w-15rem justify-content-between">

        <div className="player_station">
          {/* current station name */}
          {
            current_station ?
              <QueryLink to={generatePath(app_routes["station$id"], { id: current_station?.id })} className="radio_card_header align-self-center font-bold text-primary text_hidden_overflow line-clamp-2 text-center">
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
            current_station?.tags?.map(tag => <StationTag tag={tag} key={tag}/>)
          }

        </div>

      </div>

      <div className="flex flex-column">
        {/* history button */}

        {/* random station */}

        {/* random with similar tag */}
      </div>

    </div>
  )
})