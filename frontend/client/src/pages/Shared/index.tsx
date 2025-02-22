import { memo, useEffect, useMemo, useState, useTransition } from "react"

import {
  StationsGrid,
} from "@/components"

import {
  useStore,
} from "@/store"

import { Station } from "@/types"

import { useLoaderData } from "react-router-dom"

import { decompressFromEncodedURIComponent } from 'lz-string'

export const Shared = memo(() => {

  const ids = useLoaderData() as string

  const home_stations = useStore().app.stations_home()

  const home_stations_loading = !useStore().app.stations_home_loaded()

  const [stations, set_stations] = useState<Station[]>([])

  const [loading, startTransition] = useTransition()

  const [decompressed, set_decompressed] = useState<string[]>([])

  useEffect(() => {
    startTransition(() => {
      set_decompressed(decompressFromEncodedURIComponent(decodeURI(ids)).split(','))
    })
  }, [ids])

  const not_all_stations_loaded = useMemo(() => stations.length < decompressed.length, [stations.length, decompressed.length])

  useEffect(() => {
    if (ids) {
      startTransition(() => {

        set_stations(home_stations.filter(station => decompressed.includes(station.id)))
      })
    }
  }, [decompressed, home_stations])

  return (
    <StationsGrid
      stations={stations}
      loading={loading || (not_all_stations_loaded && home_stations_loading)}
      place={'home'}
    />
  )
})