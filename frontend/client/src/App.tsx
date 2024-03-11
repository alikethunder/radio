import React, { useEffect } from "react"

import {
  Outlet,
  //useLoaderData,
  useNavigate,
  useLocation,
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
  RightSidebar,
} from './components'

import { getCookie } from "./functions"

import {
  WS,
} from './mechanics'

import {
  FrontUser,
} from '@/types'

import { actions, useTrackedStore, store, useStore } from "@/store"

import {
  onLogout,
  useImmutableFetcher,
  sortByPriority,
  useImmutableFetcherAndStore,
} from './functions'

//console.log('typeof window : ', typeof window)

/* import favicon from './assets/favicon.ico' */

export default function App() {

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const windowSize = useWindowSize()

  useEffect(() => {
    //code for reloading on code change during development
    new Sockette('ws://localhost:3000/reloadws', {
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

      console.log('[app] user : ', user)

      actions.auth.signedin(true);
      //@ts-ignore
      (Object.entries(user)).forEach(entry => (actions.user[entry[0]])(entry[1]));

      if ([
        '/signup',
        '/signin',
        '/reset-password',
        '/verification'
      ].find(path => pathname.includes(path))) {
        navigate('/home')
      }
    } catch (e) {
      onLogout()
    }

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

  const signedin = useTrackedStore().auth.signedin()

  /* const { error: getUserPlanErr, data: subscriptionPlan, isLoading: subscriptionPlanIsLoading } = useImmutableFetcher(signedin ? '/api/v1/purchase-plan/get-user-plan' : null) */

  useImmutableFetcherAndStore('/api/v1/purchase-plan/get-plans', "app","subscription_plans")

  useImmutableFetcherAndStore(
    signedin ? '/api/v1/purchase-plan/get-user-plan' : null,
    'user',
    'subscription_plan'
  )

  return (
    <PrimeReactProvider value={{
      appendTo: 'self',
      ripple: true,
    }}>
      {/*  <WS /> */}

      {/* {//logged in condition
        useTrackedStore().auth.signedin()
          ?
          <Navbar />
          :
          ''
      } */}

      <Button
        className="border-circle fixed top-0 right-0 mr-4 mt-3"
        severity="info"
        text
        raised
        icon="pi pi-bars"
        onClick={() => actions.app.rightSidebarOpened(true)} />

      <RightSidebar />

      <Outlet />

      <Toasts />
    </PrimeReactProvider>
  )
}