import React, { useEffect, useState } from "react"

import {
  Outlet,
  //useLoaderData,
  useNavigate,
  useLocation,
  useBlocker,
  matchPath,
  useMatch,
  useSearchParams,
} from "react-router-dom"

import { PrimeReactProvider } from 'primereact/api'

import 'primereact/resources/themes/soho-light/theme.css'

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
  LeftSidebar,
  RightSidebar,
  RestrictedPage,
  QueryLink,
  Player,
} from '@/components'

import { useLog, usePageInList } from '@/hooks'

import {
  WS,
} from '@/mechanics'

import {
  FrontUser,
} from '@/types'

import {
  actions,
  useTrackedStore,
  store,
  useStore
} from "@/store"

import {
  onLogout,
  getCookie,
} from '@/functions'

import {
  all_routes,
  app_routes,
  auth_routes,
  route_attributes,
} from '@/constants/router'

import { admin } from "@/API/profile/admin"

import { get_station } from "@/API/station/get_station"

//console.log('typeof window : ', typeof window)

/* import favicon from './assets/favicon.ico' */

export default function App() {

  const navigate = useNavigate()

  const location = useLocation()

  const { pathname, search } = location

  //useEffect(() => { console.log('location : ', location, location.key) }, [location])

  const [searchParams, set_search] = useSearchParams()

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
    console.log('get station')
    const current_station = store.player.current_station()
    if (current_station?.id) {
      (async () => {
        const station = await get_station(current_station.id)
        actions.player.current_station(station)
      })()
    }
  }, [])

  const windowSize = useWindowSize()

  const [checked_signin, set_checked_signin] = useState(false)

  useEffect(() => {
    //console.log('import.meta.env.VITE_DEV_PORT : ', import.meta.env.VITE_DEV_PORT)
    //code for reloading on code change during development
    new Sockette(`ws://localhost:${import.meta.env.VITE_DEV_PORT}/reloadws`, {
      timeout: 5000,
      maxAttempts: 1,
      onopen() {
        //console.log('ws opened')
      },
      onreconnect: () => {
        window.location.reload()
      },
    })
  }, [])

  const [authPage, checked_auth_page] = usePageInList(auth_routes)

  const signedin = useStore().auth.signedin()

  //check what route is active and set appropriate current page
  const [current_route, checked_current_route] = usePageInList(all_routes)

  useEffect(() => {
    if (checked_current_route && current_route) {

      const current_route_attrs = route_attributes[current_route]

      //console.log('current page : ', current_route_attrs)

      if (current_route_attrs) {
        actions.app.current_page(current_route_attrs)
      }
    }
  }, [
    current_route, checked_current_route
  ])
  //let data: any = useLoaderData()

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

      //console.log('[App.tsx] user : ', user)

      actions.auth.signedin(true)

      actions.user.update_user_data(user)
    } catch (e) {
      onLogout()
    }

    set_checked_signin(true)

  }, [])

  useEffect(() => {
    actions.app.isDesktop(
      (
        windowSize?.width ? windowSize?.width > 768.1 : false
      )
      && (
        windowSize?.height ? windowSize?.height > 768.1 : false
      )
    )
    const { width, height } = windowSize

    actions.app.windowSize({
      width: width ?? 0,
      height: height ?? 0
    })

  }, [windowSize])

  useEffect(() => {
    //save prev path to redirect after signin/up
    if (
      pathname
      && checked_auth_page
      && !authPage
    ) {
      //console.log('[App] set prev_pathname : ', pathname)

      actions.app.prev_pathname(pathname)
    }
  }, [
    pathname,
    authPage,
    checked_auth_page
  ])

  const is_project_page = useMatch(app_routes.project$id)

  useEffect(() => {
    //language preset
    (async () => {
      const resp = await fetch('/api/v1/translation')

      if (resp.status == 200) {
        const languages = await resp.json()

        actions.persistedApp.languages(languages)

        const curr_selected_lang = store.persistedApp.language()

        if (!curr_selected_lang || !languages.includes(curr_selected_lang)) {
          //lang was not set or it is not supported

          //get navigator language
          const nav_lang = navigator.language.substring(0, 2)

          if (languages.includes(nav_lang)) {
            actions.persistedApp.language(nav_lang)
          } else {
            //navigator language is not supported
            //find supported in navigator languages

            const supported_navigator_languages = navigator.languages.find(l => languages.includes(l))

            actions.persistedApp.language(supported_navigator_languages ?? languages[0])

          }
        }
      }
    })()
  }, [])

  return (
    <PrimeReactProvider value={{
      appendTo: 'self',
      ripple: true,
    }}>
      {/*  <WS /> */}

      <Navbar />

      {
        is_project_page ?
          <Button
            className="border-circle fixed top-0 left-0 ml-4 mt-3"
            severity="info"
            text
            raised
            icon="pi pi-bars"
            onClick={
              () => actions.app.leftSidebarOpened(true)
            } />
          : ''
      }



      <LeftSidebar />

      <RightSidebar />

      {
        checked_signin ?
          <>
            <RestrictedPage>

              <Outlet />

            </RestrictedPage>
          </>
          : <></>
      }

      <Player />

      <Toasts />

      <ConfirmDialog />

    </PrimeReactProvider>
  )
}