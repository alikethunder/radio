import {
  useLoaderData,
} from "react-router-dom"

import { StationCard, } from "@/components"

import {
  useStore,
} from "@/store"

import {
  useStationsSearch,
  useTranslations,
} from '@/hooks'

import {
  useLog,
} from '@/hooks'

import { Station } from "@/types"

import { Helmet } from "react-helmet"

export const FavoriteStations = () => {

  const stations = useLoaderData() as Station[]

  //useLog(true, '[FavoriteStations] stations : ', stations)

  const language = useStore().translations.language()

  const searched_stations = useStationsSearch(stations)

  const [translations] = useTranslations([
    "my_stations",
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
          searched_stations?.length ?
            <div className={`stations_list row-gap-2 column-gap-3 mb-4`}>
              {searched_stations?.map(station =>
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