import { memo, useEffect, useMemo, useState } from "react"

import {
  StationsGrid,
} from "@/components"

import {
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

  const [stations, set_stations] = useState<Station[]>([])
  const [loading, set_loading] = useState(true)

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
    (async () => {
      const limit = 200
      let from
      while (true) {

        const res = await list({ limit, admin: store.user.admin(), ...from ? { from } : {} })

        //console.log(`[stations] list result : `, res)

        set_stations(s => s.concat(res))

        if (!res.length || res.length < limit) {
          //console.log('set loading false ')
          set_loading(false)
          break
        }

        from = res[res.length - 1].id
      }
    })()
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

  return (
    <StationsGrid
      stations={stations}
      loading={loading}
    />
  )
})