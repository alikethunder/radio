import React, { useEffect, } from "react"

import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom"

import { PrimeReactProvider } from 'primereact/api'

import 'primeicons/primeicons.css'

import '@/sass/primeflex/primeflex.scss'

import './index.sass'

import Sockette from 'sockette'

import { useWindowSize } from "usehooks-ts"

import { Button } from 'primereact/button'

import { ConfirmDialog } from 'primereact/confirmdialog'

import {
  Toasts,
  Navbar,
  RightSidebar,
  Player,
  StationSearchPanel,
} from '@/components'

import { useLog, usePageInList } from '@/hooks'

import {
  WS,
} from '@/mechanics'

import {
  actions,
  store,
  useStore
} from "@/store"

import {
  onLogout,
  getCookie,
} from '@/functions'

import {
  all_routes,
  auth_routes,
  route_attributes,
} from '@/constants/router'

import { get_station } from "@/API/station/get_station"
import { update_json } from "./API/profile/update_json"

//console.log('typeof window : ', typeof window)

export default function App() {

  const navigate = useNavigate()

  const location = useLocation()

  const { pathname, search } = location

  //useEffect(() => { console.log('location : ', location, location.key) }, [location])

  //useLog(true, '[App] location : ', location)

  const signedin = useStore().auth.signedin()

  const [searchParams, set_search] = useSearchParams()

  useEffect(() => {
    // to redirect from google login 
    if (store.session.prev_pathname() && store.session.redirect_from_google()) {
      actions.session.redirect_from_google(false)
      //console.log('signedin : ', signedin)
      if (signedin) {
        console.log('signedin navigate: ', signedin, store.session.prev_pathname())
        navigate(store.session.prev_pathname(), { replace: true })
      }
    }
  }, [signedin])

  useEffect(() => {
    setTimeout(() => {
      if (searchParams.has('auth')) {
        searchParams.delete('auth')
        set_search(searchParams, { replace: true })
      }
    }, 1000)
  }, [searchParams, search])

  useEffect(() => {
    (async () => {
      const resp = await fetch('/api/v1/tags/')
      const json = await resp.json()
      actions.app.station_tags(json ?? [])
    })()
  }, [])

  useEffect(() => {
    //console.log('get station')
    const current_station = store.player.current_station()
    if (current_station?.id) {
      (async () => {
        const station = await get_station(current_station.id)
        actions.player.current_station(station)
      })()
    }
  }, [])

  const windowSize = useWindowSize()

  /* useEffect(() => {
    //code for reloading on code change during development
    new Sockette(`${window.location.origin}/reloadws`, {
      timeout: 5000,
      maxAttempts: 1,
      onopen() {
        //console.log('ws opened')
      },
      onreconnect: () => {
        window.location.reload()
      },
    })
  }, []) */

  const [authPage, checked_auth_page] = usePageInList(auth_routes, null, null)

  //check what route is active and set appropriate current page
  const [current_route, checked_current_route] = usePageInList(all_routes)

  useEffect(() => {
    if (checked_current_route && current_route) {

      const current_route_attrs = route_attributes[current_route as keyof typeof route_attributes]

      console.log('[App] current page : ', current_route_attrs)

      if (current_route_attrs) {
        actions.app.current_page({ ...current_route_attrs })
      }
    }
  }, [
    current_route, checked_current_route
  ])

  useEffect(() => {
    //**effects is running only on client
    if (typeof window !== 'undefined') {
      actions.app.isClient(true)
    }
  }, [])

  useEffect(() => {
    try {
      let user_cookie = getCookie('user') as string
      console.log('user_cookie : ', user_cookie)

      const user = JSON.parse(decodeURIComponent(user_cookie))

      console.log('[App.tsx] user : ', user)

      actions.auth.signedin(true)

      actions.user.update_user_data(user)

      console.log('[App] user.favorite_stations : ', user.favorite_stations)

      if (user?.favorite_stations.length) {
        actions.persistedApp.favorite_stations(user.favorite_stations)
      }
    } catch (e) {
      console.log(e)
      onLogout()
    }
  }, [])

  useEffect(() => {
    if (signedin) {
      const anonym_favorite_stations = store.persistedApp.favorite_stations()

      const user_favorite_stations = store.user.favorite_stations()

      const new_fav_stations = anonym_favorite_stations.filter(id => !user_favorite_stations.includes(id))

      const updated_fav_stations = [...new_fav_stations, ...user_favorite_stations]

      if (new_fav_stations.length) {
        update_json({ favorite_stations: updated_fav_stations })

        actions.user.favorite_stations(updated_fav_stations)
      }
    }
  }, [
    signedin,
  ])

  useEffect(() => {
    //save prev path to redirect after signin/up
    if (
      checked_auth_page
      && !authPage
    ) {
      //console.log('[App] prev pathanme : ', pathname, authPage, checked_auth_page)
      actions.session.prev_pathname(pathname)
    }
  }, [
    authPage,
    checked_auth_page
  ])

  useEffect(() => {
    //language preset
    (async () => {
      const resp = await fetch('/api/v1/translation')

      if (resp.status == 200) {
        const languages = await resp.json()

        actions.translations.languages(languages)

        const curr_selected_lang = store.translations.language()

        if (!curr_selected_lang || !languages.includes(curr_selected_lang)) {
          //lang was not set or it is not supported

          //get navigator language
          const nav_lang = navigator.language.substring(0, 2)

          if (languages.includes(nav_lang)) {
            actions.translations.language(nav_lang)
          } else {
            //navigator language is not supported
            //find supported in navigator languages

            const supported_navigator_languages = navigator.languages.find(l => languages.includes(l))

            actions.translations.language(supported_navigator_languages ?? languages[0])

          }
        }
      }
    })()
  }, [])

  const language = useStore().translations.language()

  const languages = useStore().translations.languages()

  useEffect(() => {
    //update language in url
    if (languages.length && language) {
      set_search(s => {
        s.set('language', language)
        return s
      })
    }
  }, [language, languages])

  return (
    <PrimeReactProvider value={{
      appendTo: 'self',
      ripple: true,
    }}>
      {/*  <WS /> */}

      <Navbar />

      <StationSearchPanel />

      <RightSidebar />

      <Outlet />

      <Player />

      <Toasts />

      <ConfirmDialog />

    </PrimeReactProvider>
  )
}