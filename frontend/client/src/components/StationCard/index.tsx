import { FC, memo, useEffect, } from "react"

import {
  QueryLink,
  StationTag,
} from '@/components'

import {
  app_routes,
} from '@/constants/router'

import {
  actions,
  useStore,
  store,
} from "@/store"

import { generatePath } from "react-router-dom"

import { classNames } from "primereact/utils"

import { useDebounceCallback } from "usehooks-ts"
import { Station } from "@/types"
import { Ripple } from "primereact/ripple"

import './index.sass'

type Props = {
  station: Station;
  style: {
    [x: string]: any;
  }
}

export const StationCard: FC<Props> = memo(({ station, style, }) => {
  //console.log(style)

  const current_station = useStore().player.current_station()

  const playing = useStore().player.playing()

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const play_click = useDebounceCallback((station) => {
    if (store.player.playing() && store.player.current_station()?.id == station.id) {
      actions.player.playing(false)
    } else {
      actions.player.playing(true)
      actions.player.current_station(station)
    }
  }, 50)

  return (
    station ?
      <div className="flex flex-column gap-2" style={style}>

        <div className={classNames({
          'current_station active_element': current_station?.id == station.id,
        },
          'flex',
          'flex-column',
          'gap-1',
          'overflow-hidden',
          'text-primary',
          'shadow_card',
          'element_with_overlay',
          'w-full',
          'h-13rem',
          'flex-shrink-0 shadow-2 border-round',
          'surface-card',
        )}>

          <div className="flex flex-row gap-1">
            <div
              className="w-full h-5rem flex align-items-center justify-content-center p-ripple relative surface-100"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                play_click(station)
              }} >

              <i className="pi pi-wave-pulse " style={{ fontSize: '2rem' }}></i>

              <div className="absolute w-full h-full top-0 left-0 bg-no-repeat bg-contain bg-center surface-100 station_image"
                style={{
                  backgroundImage: `url(/api/v1/files/stations/${station.id}/avatar)`,
                }} >

                <img
                  style={{ display: 'none' }}
                  src={`/api/v1/files/stations/${station.id}/avatar`}

                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null

                    const p = currentTarget.closest('.station_image') as HTMLElement

                    if (p) p.style.display = 'none'
                  }}
                />
              </div>

              <div
                className="overlay absolute top-0 bottom-0 right-0 left-0 flex align-items-center justify-content-center text-center cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  play_click(station)
                }}>

                <div className="overlay_background p-component-overlay absolute top-0 bottom-0 right-0 left-0"></div>

                <div className="overlay_text z-1" style={{
                  color: '#fff'
                }}>
                  <i className={`font-semibold pi ${current_station?.id == station.id && playing ? 'pi-pause' : 'pi-play'}`} style={{
                    fontSize: '2rem',
                    textShadow: '0 0 7px',
                  }}></i>
                </div>

              </div>

              <Ripple />

            </div>

            {/* likes listeners */}
          </div>

          <div className="flex flex-column justify-content-between flex-grow-1 px-1 pb-1">

            <div className="flex flex-column justify-content-center flex-grow-1">

              <QueryLink to={generatePath(app_routes["station$id"], { id: station.id })} className="font-bold text-primary text-center station_name mb-1  text_hidden_overflow line-clamp-3 action_text_font text-lg">
                {station.name}
              </QueryLink>
            </div>

            <div className="station_tags_container text-center text_hidden_overflow line-clamp-2 flex-shrink-0">
              {
                station.tags.map(tag => <StationTag tag={tag} />)
              }
            </div>
          </div>

        </div>

        {
          edit_mode ?
            <div className="flex flex-row flex-wrap flex-shrink-0 align-items-start gap-1 overflow-hidden">

              <StationTag tag="Broadcasting" color={station.broadcasting ? 'green-400' : 'surface-300'} disable_link />

              <StationTag tag="External" color={station.external && station.external_enable ? 'green-400' : 'surface-300'} disable_link />
            </div>
            : <></>
        }
      </div>
      : <></>
  )
}, (o, n) => {
  return o.station?.id === n.station?.id
    && o.style.height === n.style.height
    && o.style.top === n.style.top
    && o.style.width === n.style.width
    && o.style.left === n.style.left
})