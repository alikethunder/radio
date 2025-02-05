import { memo, useEffect, useMemo, useState } from "react"

import {
  StationsGrid,
} from "@/components"

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  useFormState,
} from '@/hooks'

import {
  useLog,
} from '@/hooks'

import { Station } from "@/types"

import { Helmet } from "react-helmet"
import { list } from "@/API/station/list"

export const Home = memo(() => {

  const stations = useStore().app.stations_home()
  const loading = !useStore().app.stations_home_loaded()

  //useLog(true, '[Home] stations : ', stations)

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const signedin = useStore().auth.signedin()

  const root_admin = useStore().user.admin()

  const current_user_id = useStore().user.id()

  const some_station_admin = useMemo(() => signedin
    && current_user_id
    && stations.some(station => station.admins?.includes(current_user_id)), [
    signedin,
    root_admin,
    stations,
    current_user_id
  ])

  const [formState, set_formState] = useState({
    isValid: true,
    isSubmitting: false,
  })

  useEffect(() => {
    if (!store.app.stations_home_loaded()) {
      (async () => {
        const limit = 400
        while (true) {
          const from = store.app.stations_home_last_id()

          const res = await list({ limit, admin: store.user.admin(), ...from ? { from } : {} })

          //console.log(`[stations] list result : `, res)
          actions.app.add_stations_home(res)
          actions.app.stations_home_last_id(res[res.length - 1].id)

          if (!res.length || res.length < limit) {
            //console.log('set loading false ')
            actions.app.stations_home_loaded(true)
            break
          }

        }
      })()
    }
  }, [])

  useFormState({
    submit() {
      //submit reorder of stations
      set_formState(fs => {
        fs.isSubmitting = true
        return fs
      })

      set_formState(fs => {
        fs.isSubmitting = false
        return fs
      })
    },
    reset() {
      //reset order of stations

    },
  }, formState, root_admin || some_station_admin)

  /* const grid_ref = useStore().app.stations_grid_ref()

  useEffect(() => {
    console.log('[Home] grid ref : ', grid_ref)

    if (grid_ref) {
      const scroll = store.persistedApp.home_scroll()
      grid_ref.scrollTo()

    }
  }, [grid_ref]) */

  return (
    <StationsGrid
      stations={stations}
      loading={loading}
      place={'home'}
    />
  )
})