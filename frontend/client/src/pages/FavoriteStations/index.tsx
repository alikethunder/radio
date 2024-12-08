import { StationsGrid, } from "@/components"

import {
  useStore,
} from "@/store"

import {
  useFavoriteStations,
  useTranslations,
} from '@/hooks'

import {
  useLog,
} from '@/hooks'

import { Station } from "@/types"

import { Helmet } from "react-helmet"
import { useEffect, useState } from "react"

export const FavoriteStations = () => {

  //const stations = useLoaderData() as Station[]
  const [stations, set_stations] = useState<Station[]>([])
  const [loading, set_loading] = useState(true)

  const favorite_stations = useFavoriteStations()

  useEffect(() => {
    if (favorite_stations.length) {
      console.log(`[FavoriteStations] favorite_stations : `, favorite_stations);
      (async () => {

        const res = await fetch(`/api/v1/radio/stations-by-id`, {
          method: 'POST',
          body: JSON.stringify({
            ids: favorite_stations.join(',')
          }),
        })

        const json = await res.json()
        console.log(`[FavoriteStations] list result : `, json)

        set_stations(json)

        set_loading(false)

      })()
    }
  }, [favorite_stations])

  useLog(true, '[FavoriteStations] stations : ', stations)

  const [translations] = useTranslations([
    "my_stations",
    'no_stations_with_parameters',
  ], true)

  return (
    <>
      <Helmet>
        <title>{translations.my_stations}</title>

        <meta name="description" content={translations.my_stations} />

      </Helmet>

      <StationsGrid
        stations={stations}
        loading={loading}
      />
    </>
  )
}