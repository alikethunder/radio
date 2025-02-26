import { CSSProperties, FC, memo, useCallback, } from "react"

import {
  AddStationToFavorites,
  QueryLink,
  StationAvatar,
  StationCountryFlag,
  StationInfoButton,
  StationShareButton,
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
import { useTranslations } from "@/hooks"

type Props = {
  station: Station;
  style?: {
    [x: string]: any;
  };
  at_history?: boolean;
}

export const StationCard: FC<Props> = memo(({ station, style, at_history, }) => {
  //console.log(style)

  const current_station = useStore().player.current_station()

  const playing = useStore().player.playing()

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const play_click = useCallback(useDebounceCallback((station) => {
    if (store.player.playing() && store.player.current_station()?.id == station.id) {
      actions.player.playing(false)
    } else {
      actions.player.playing(true)

      if (at_history) {
        actions.player.current_history_station_id(station.id)
      }

      actions.player.current_station(station)
    }
  }, 50), [
    at_history,
  ])

  const [translations] = useTranslations([
    'open_search_stations_panel',
  ], true)


  return (
    station ?
      <div className="flex flex-column gap-2 flex-shrink-0" style={style}>

        <div className={classNames({
          'current_station active_element border-primary': current_station?.id == station.id,
        },
          'flex',
          'flex-column',
          'gap-1',
          'overflow-hidden',
          'text-primary',
          'shadow_card hover:border-primary',
          'element_with_overlay',
          'w-full',
          'w-9rem h-13rem',
          'flex-shrink-0 shadow-2 border-round',
          'surface-card',
        )}
          style={{
            border: '2px solid var(--surface-100)',
          }}
        >

          <div className="flex flex-row gap-1 relative">
            <StationCountryFlag disable_link en={station?.country} className="absolute top-0 left-0 z-1 m-05 mt-1" />

            <div
              className="w-full h-5rem flex align-items-center justify-content-center p-ripple relative surface-100"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                play_click(station)
              }} >

              <StationAvatar
                id={station?.id}
                className="absolute w-full h-full top-0 left-0 surface-100"
              />

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

              <QueryLink to={generatePath(app_routes["station$id"], { id: station.id })} className="font-bold text-primary text-center station_name mb-1  text_hidden_overflow line-clamp-3 action_text_font text-xl" style={{
                wordBreak: 'break-word',
              }}>
                {station.name}
              </QueryLink>
            </div>

            <div className="flex flex-row justify-content-around align-items-center pb-1">

              <AddStationToFavorites station={station} />

              <StationShareButton station={station} />

              <StationInfoButton station={station} />

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
    && o.style?.height === n.style?.height
    && o.style?.top === n.style?.top
    && o.style?.width === n.style?.width
    && o.style?.left === n.style?.left
})