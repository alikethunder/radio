import React, { useEffect, useState } from "react"

import {
  Outlet,
  //useLoaderData,
  useNavigate,
  useLocation,
  useBlocker,
  matchPath,
  useMatch,
} from "react-router-dom"

import { PrimeReactProvider } from 'primereact/api'

import 'primereact/resources/themes/soho-light/theme.css'

import 'primeicons/primeicons.css'

import '@/sass/primeflex/primeflex.scss'

import './index.sass'

import Sockette from 'sockette'

import { useWindowSize } from "usehooks-ts"

import { Button } from 'primereact/button'

import {
  Toasts,
  Navbar,
  LeftSidebar,
  RightSidebar,
  RestrictedPage,
  QueryLink,
} from './components'

import {
  getCookie,
} from "./functions"

import { usePageInList } from '@/hooks'

import {
  WS,
} from './mechanics'

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
  useImmutableFetcher,
  sortByPriority,
  useImmutableFetcherAndStore,
} from './functions'

import {
  all_routes,
  app_routes,
  auth_routes,
  route_attributes,
} from '@/constants/router'

//console.log('typeof window : ', typeof window)

/* import favicon from './assets/favicon.ico' */

export default function App() {

  const navigate = useNavigate()
  const { pathname } = useLocation()

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
      console.log('current page : ', current_route)
      actions.app.current_page(route_attributes[current_route] ?? '')
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

      const user = JSON.parse(decodeURIComponent(user_cookie))

      //console.log('[App.tsx] user : ', user)

      actions.auth.signedin(true);
      //@ts-ignore
      (Object.entries(user)).forEach(entry => (actions.user[entry[0]])(entry[1]));
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

  /* const { error: getUserPlanErr, data: subscriptionPlan, isLoading: subscriptionPlanIsLoading } = useImmutableFetcher(signedin ? '/api/v1/purchase-plan/get-user-plan' : null) */

  /* useImmutableFetcherAndStore('/api/v1/purchase-plan/get-plans', "app", "subscription_plans")

  useImmutableFetcherAndStore(
    signedin ? '/api/v1/purchase-plan/get-user-plan' : null,
    'user',
    'subscription_plan'
  ) */

  useEffect(() => {
    //save prev path to redirect after signin/up
    if (
      pathname
      && checked_auth_page
      && !authPage
    ) {
      actions.app.prev_pathname(pathname)
    }
  }, [
    pathname,
    authPage,
    checked_auth_page
  ])

  const is_project_page = useMatch(app_routes.project$id)

  return (
    <PrimeReactProvider value={{
      appendTo: 'self',
      ripple: true,
    }}>
      {/*  <WS /> */}

      {
        false ?
        //authPage ?
          <></>
          :
          <Navbar />
      }

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
          <RestrictedPage>

            <Outlet />

          </RestrictedPage>
          : <></>
      }

      <Toasts />
    </PrimeReactProvider>
  )
}