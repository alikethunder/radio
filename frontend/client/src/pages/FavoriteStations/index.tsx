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
import { useEffect, useState, useTransition } from "react"
import { useNavigate } from "react-router-dom"

export const FavoriteStations = () => {

  //const stations = useLoaderData() as Station[]
  const [stations, set_stations] = useState<Station[]>([])
  const loading = !useStore().app.stations_favorite_loaded()

  const navigate = useNavigate()

  const home_stations = useStore().app.stations_home()

  const home_stations_loaded = useStore().app.stations_home_loaded()

  const auth_checked = useStore().auth.checked()

  const [isPending, startTransition] = useTransition()

  const favorite_stations = useFavoriteStations()
  //useLog(true, '[FavoriteStations] favorite_stations : ', favorite_stations)

  useEffect(() => {
    if (auth_checked) {
      if (
        favorite_stations.length
      ) {

        if (home_stations_loaded) {
          startTransition(() => {
            set_stations(home_stations.filter(station => favorite_stations.includes(station.id)))
          })
        } else {
          actions.app.stations_favorite_loaded(false)
        }

      } else {
        navigate('/')
      }
    }
  }, [
    favorite_stations,
    home_stations,
    home_stations_loaded,
    auth_checked,
  ])

  useEffect(() => {
    if (home_stations_loaded) {
      actions.app.stations_favorite_loaded(!isPending)
    }
  }, [isPending, home_stations_loaded])

  //useLog(true, '[FavoriteStations] stations : ', stations)
  //useLog(true, '[FavoriteStations] loading : ', loading)

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