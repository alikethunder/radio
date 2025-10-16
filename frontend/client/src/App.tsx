import React, { useCallback, useEffect, memo, useState, useMemo, } from "react"

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
import * as Sentry from "@sentry/react"

import { useWindowSize } from "usehooks-ts"

import { ConfirmDialog } from 'primereact/confirmdialog'

import {
  Toasts,
  Navbar,
  RightSidebar,
  Player,
  StationSearchPanel,
  DynamicTooltip,
  StationInfoDialog,
  ShareListPopup,
  YandexAd,
} from '@/components'
import { list } from "@/API/station/list"

import { useLog, useMobile, usePageInList, useTranslations } from '@/hooks'

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
  ga_event,
  get_api_origin,
} from '@/functions'

import {
  all_routes,
  auth_routes,
  route_attributes,
} from '@/constants/router'

import { get_station } from "@/API/station/get_station"
import { update_json } from "@/API/profile/update_json"
import { StationCountry, Language, StationLanguage, StationGenre, HistoryRecord } from "@/types"

export default memo(function App() {

  const navigate = useNavigate()

  const location = useLocation()

  const theme = useStore().persistedApp.theme()

  const auth_checked = useStore().auth.checked()

  const mobile = useMobile()

  const { pathname, search } = location

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ga_event({
        event: 'navigation',
        params: {
          pathname,
          search,
        },
        window_location: window.location,
      })
    }
  }, [
    pathname,
    search,
  ])

  //useEffect(() => { console.log('location : ', location, location.key) }, [location])

  //useLog(true, '[App] location : ', location)

  const signedin = useStore().auth.signedin()

  const language = useStore().translations.language()

  const languages = useStore().translations.languages()

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
    //console.log('get station')
    const current_station = store.player.current_station()
    if (current_station?.id) {
      (async () => {
        const station = await get_station(current_station.id)
        actions.player.current_station(station)
      })()
    }
  }, [])

  useEffect(() => {
    if (!store.app.stations_home_loaded()) {
      (async () => {
        const limit = 400
        while (true) {
          const from = store.app.stations_home_last_id()

          const res = await list({ limit, ...from ? { from } : {} })

          //console.log(`[stations] list result : `, res)
          actions.app.add_stations_home(res)
          actions.app.stations_home_last_id(res[res.length - 1].id)

          if (!res.length || res.length < limit) {
            //console.log('set loading false ')
            //console.log('[Home] stations : ', store.app.stations_home())
            //window.stations = store.app.stations_home()
            actions.app.stations_home_loaded(true)
            break
          }

        }
      })()
    }
  }, [])

  const current_station = useStore().player.current_station()

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

      //console.log('[App] current page : ', current_route_attrs)

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
      //console.log('user_cookie : ', user_cookie)

      const user = JSON.parse(decodeURIComponent(user_cookie))

      //console.log('[App.tsx] user : ', user)

      actions.auth.signedin(true)

      actions.user.update_user_data(user)

      //console.log('[App] user.favorite_stations : ', user.favorite_stations)

      if (user?.favorite_stations.length) {
        actions.persistedApp.favorite_stations(user.favorite_stations)
      }
    } catch (e) {
      console.log(e)
      onLogout()
    } finally {
      actions.auth.checked(true)
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
      // ?????????????????????????
    //language preset
    (async () => {
      const resp = await fetch(`${get_api_origin()}/api/v1/translation`)

      if (resp.status == 200) {
        const languages = await resp.json()

        actions.translations.languages(languages)

        const curr_selected_lang = store.translations.language()

        if (!curr_selected_lang || !languages.includes(curr_selected_lang)) {
          //lang was not set or it is not supported

          //get navigator language
          const nav_lang = navigator.language.substring(0, 2)

          if (languages.includes(nav_lang)) {
            actions.translations.language(nav_lang as Language)
          } else {
            //navigator language is not supported
            //find supported in navigator languages

            const supported_navigator_languages = navigator.languages.find(l => languages.includes(l.substring(0, 2)))

            actions.translations.language(supported_navigator_languages ?? languages[0])

          }
        }
      }
      // ?????????????????????????
    })()
  }, [])

  useEffect(() => {
    //update language in url
    if (languages.length && language) {
      set_search(s => {
        s.set('language', language)
        return s
      })
    }
  }, [language, languages])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {

        if ('serviceWorker' in navigator) {
          const prev_sws = await navigator.serviceWorker.getRegistrations()

          for (const sw of prev_sws) {
            await sw.unregister()
          }

          try {

            const serviceWorkerRegistration = await navigator.serviceWorker.register(`${get_api_origin()}/service-worker.js`, {
              scope: '/'
            })

          } catch (e) {
            console.log('[service-worker] init err : ', e)
          }
        }
      })()
    }
  }, [])

  const pwa_event = useStore().session.pwa_event()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.PWAInstallEvent) {
        actions.session.pwa_event(window.PWAInstallEvent)
      } else {
        //@ts-ignore
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();

          window.PWAInstallEvent = e
          actions.session.pwa_event(e)
        }, { once: true })
      }
    }
  }, [])

  useEffect(() => {
    //store pwa install event
    if (typeof window !== 'undefined') {
      document.addEventListener('PWAEvent', (e) => {
        actions.session.pwa_event(window.PWAInstallEvent)
      }, { once: true })
    }
  }, [])

  const install_pwa = useCallback(() => {
    if (store.session.pwa_event()) {
      try {
        store.session.pwa_event()?.prompt()
      } catch (e) {
        console.log('no pwa event error : ', e)
      }
      actions.session.pwa_event(null)
    }
  }, [])

  useEffect(() => {
    //trigger pwa install event
    if (store.session.pwa_event()) {
      setTimeout(() => {
        document.addEventListener('mousedown', install_pwa, { once: true })
        document.addEventListener('mousemove', install_pwa, { once: true })
        document.addEventListener('touchmove', install_pwa, { once: true })
        document.addEventListener('touchstart', install_pwa, { once: true })
        document.addEventListener('touchcancel', install_pwa, { once: true })
        document.addEventListener('touchmove', install_pwa, { once: true })
      }, 10000)
    }
  }, [pwa_event])

  useEffect(() => {
    //load history if user logged in and it was checked
    if (typeof window !== 'undefined') {
      if (auth_checked) {

        if (signedin) {
          (async () => {
            const resp = await fetch(`${get_api_origin()}/api/v1/history`)
            const history = await resp.json() as HistoryRecord[]
            console.log('[history] loaded : ', history)

            actions.player.history(history ?? [])

            actions.app.history_loaded(true)
          })()
        } else {
          actions.app.history_loaded(true)
        }
      }
    }
  }, [
    auth_checked,
    signedin,
  ])

  return (
    <PrimeReactProvider value={{
      appendTo: 'self',
      ripple: true,
    }}>
      {/*  <WS /> */}

      <Navbar />

      {
        current_station ? <Player /> : <></>
      }

      <StationSearchPanel />

      <RightSidebar />

      <Outlet />

      <Toasts />

      <ConfirmDialog />

      <DynamicTooltip />

      <StationInfoDialog />

      <ShareListPopup />

      {
        mobile ?
          <YandexAd id="R-A-14083703-8" interval={50000} additional_render_params={{
            type: 'floorAd',
            platform: 'touch',
          }} /> :
          <YandexAd id="R-A-14083703-7" interval={30000} additional_render_params={{
            type: 'floorAd',
            platform: 'desktop',
          }} />
      }

    </PrimeReactProvider>
  )
})