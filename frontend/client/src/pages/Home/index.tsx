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
import { is_ssr } from "@/functions"
import { useLoaderData } from "react-router-dom"

export const Home = memo(() => {

  const stations = useStore().app.stations_home()
  const loading = !useStore().app.stations_home_loaded()

  const ssr_text = useLoaderData() as string

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
    <>
      <StationsGrid
        stations={stations}
        loading={loading}
        place={'home'}
      />

      {
        is_ssr() ?
          <span dangerouslySetInnerHTML={{ __html: ssr_text }}>
          </span>
          : <> </>
      }
    </>
  )
})