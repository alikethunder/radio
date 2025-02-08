import { StationsGrid, } from "@/components"

import {
  actions,
  store,
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
  const stations = useStore().app.stations_favorite()
  const loading = !useStore().app.stations_favorite_loaded()

  const favorite_stations = useFavoriteStations()

  useEffect(() => {
    if (
      favorite_stations.length
      && !store.app.stations_favorite_loaded()
    ) {
      console.log(`[FavoriteStations] favorite_stations : `, favorite_stations);
      const loaded_stations = store.app.stations_favorite().map(s => s.id);
      console.log(`[FavoriteStations] loaded_stations : `, loaded_stations);

      const stations_to_load = favorite_stations.filter(id => !loaded_stations.includes(id));
      console.log(`[FavoriteStations] stations_to_load : `, stations_to_load);

      if (stations_to_load.length) {
        (async () => {

          const res = await fetch(`/api/v1/radio/stations-by-id`, {
            method: 'POST',
            body: JSON.stringify({
              ids: stations_to_load.join(',')
            }),
          })

          const json = await res.json()
          console.log(`[FavoriteStations] list result : `, json)

          actions.app.add_stations_favorite(json)
          actions.app.stations_favorite_last_id(json[json.length - 1].id)

          actions.app.stations_favorite_loaded(true)

        })()
      } else {
        actions.app.stations_favorite_loaded(true)
      }
    }
  }, [])

  useLog(true, '[FavoriteStations] stations : ', stations)
  useLog(true, '[FavoriteStations] loading : ', loading)

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
        place={'my_stations'}
      />
    </>
  )
}