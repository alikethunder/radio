import { FC, useEffect, useState } from "react"

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

  const playing = useStore().player.playing()

  const volume = useStore().player.volume()

  const current_station = useStore().player.current_station()

  //console.log('navbar_actions : ', navbar_actions)

  return (
    <div className="flex flex-row flex-shrink-0 shadow-3 h-7rem justify-content-center bg-white p-2 gap-3">

      <div className="player_station_avatar w-6rem h-6rem shadow-2 bg-no-repeat bg-contain bg-center flex-shrink-0 border-round-xl">
        {/* current station avatar */}
      </div>

      <div className="flex flex-column justify-content-between">

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
        onChange={(e) => actions.player.volume(e.value as NumRange<101>)}
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

      <div className="flex flex-column w-15rem">

        <div className="player_station">
          {/* current station name */}
          {current_station?.name}

          {/*  likes*/}

          {/* listeners */}
        </div>

        <div className="player_track">
          {/* current artist - track name */}

          {/* likes */}

          {/* downloads  if downloadable */}
        </div>

        <div className="flex flex-row gap-1">
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
  )
}