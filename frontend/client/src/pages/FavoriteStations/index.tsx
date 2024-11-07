import { FC, useEffect, useMemo, useState } from "react"

import {
  useLoaderData,
  generatePath,
} from "react-router-dom"

import { Ripple } from "primereact/ripple"

import { classNames } from 'primereact/utils'

import { QueryLink, StationTag } from "@/components"

import {
  app_routes,
} from '@/constants/router'

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  useFormState,
  useTranslations,
  useTranslationsSkeleton,
} from '@/hooks'

import {
  useLog,
} from '@/hooks'

import { Station } from "@/types"
import { useDebounceCallback } from "usehooks-ts"

import { Helmet } from "react-helmet"

export const FavoriteStations = () => {

  const stations = useLoaderData() as Station[]

  useLog(true, '[FavoriteStations] stations : ', stations)

  const language = useStore().translations.language()

  const playing = useStore().player.playing()

  const current_station = useStore().player.current_station()

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const search_stations_text_array = useMemo(() => search_stations_text.replaceAll(',', '').replaceAll('-', '').replaceAll('_', '').split(' ').filter(w => !!w), [search_stations_text])

  const tags_searched_stations = useMemo(() => search_station_tags.length ? stations?.filter(station => search_station_tags.every(tag => station.tags.includes(tag))) : stations, [search_station_tags, stations])

  //useLog(true, 'tags_searched_stations : ', tags_searched_stations)

  const text_searched_stations = useMemo(() => search_stations_text_array.length ? tags_searched_stations?.filter(station => search_stations_text_array.every(w => station[`description_${language}`].toLowerCase().includes(w)) || search_stations_text_array.some(w => station.name.toLowerCase().includes(w))) : tags_searched_stations, [
    search_stations_text_array,
    tags_searched_stations,
    language,
  ])

  //useLog(true, 'text_searched_stations : ', text_searched_stations)

  const searched_stations_with_mode = useMemo(() =>
    text_searched_stations?.filter(station => station.broadcasting),
    [
      text_searched_stations,
    ])

  const play_click = useDebounceCallback((station) => {
    if (store.player.playing() && store.player.current_station()?.id == station.id) {
      actions.player.playing(false)
    } else {
      actions.player.playing(true)
      actions.player.current_station(station)
    }
  }, 50)

  const [translations] = useTranslations([
    "my_stations",
    "tags",
    'sitename',
  ], true)

  return (
    <>
      <Helmet>
        <title>{translations.my_stations}</title>

        {
          language ? <meta property="og:locale" content={language} /> : <></>
        }

        <meta name="description" content={translations.my_stations} />

      </Helmet>

      <div className="sm:py-5 py-3 sm:px-6 px-2 w-full h-full overflow-y-auto page favorite_stations_page flex-grow-1 flex flex-column">

        <div className={`stations_list row-gap-2 column-gap-3 mb-4`}>

          {
            searched_stations_with_mode?.map(station =>
              <div className="flex flex-column gap-2 w-9rem">

                <div className={classNames({
                  'current_station active_element': current_station?.id == station.id,
                },
                  'flex',
                  'flex-column',
                  'gap-1',
                  'overflow-hidden',
                  'text-primary',
                  'shadow_on_hover',
                  'element_with_overlay',
                  'w-9rem',
                  'h-13rem',
                  'flex-shrink-0 shadow-2 border-round',
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

                        <div className="overlay_background surface-900 absolute top-0 bottom-0 right-0 left-0"></div>

                        <div className="overlay_text text-white font-semibold z-1">
                          <i className={`pi ${current_station?.id == station.id && playing ? 'pi-pause' : 'pi-play'}`} style={{ fontSize: '2rem' }}></i>
                        </div>

                      </div>

                      <Ripple />

                    </div>

                    {/* likes listeners */}
                  </div>

                  <div className="flex flex-column justify-content-between flex-grow-1 px-1 pb-1">

                    <div className="flex flex-column justify-content-center flex-grow-1">

                      <QueryLink to={generatePath(app_routes["station$id"], { id: station.id })} className="font-semibold text-primary text-center station_name mb-1  text_hidden_overflow line-clamp-3">
                        {station.name}
                      </QueryLink>
                    </div>

                    <div className="station_tags_container text-center text_hidden_overflow line-clamp-2">
                      {
                        station.tags.map(tag => <StationTag tag={tag} />)
                      }
                    </div>
                  </div>

                </div>
              </div>
            )}

        </div>

      </div >
    </>
  )
}