import { useMemo, } from "react"

import {
  useLoaderData,
} from "react-router-dom"

import { StationCard, } from "@/components"

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  useTranslations,
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

  const [translations] = useTranslations([
    "my_stations",
    "tags",
    'no_stations_with_parameters',
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

        {
          searched_stations_with_mode?.length ?
            <div className={`stations_list row-gap-2 column-gap-3 mb-4`}>
              {searched_stations_with_mode?.map(station =>
                <StationCard station={station} />
              )}
            </div>
            :
            <div className="font-semibold text-2xl text-center">
              {translations.no_stations_with_parameters}
            </div>
        }

      </div >
    </>
  )
}