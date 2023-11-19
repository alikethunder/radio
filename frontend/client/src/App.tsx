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

import 'primeflex/primeflex.css'

import './index.sass'

import Sockette from 'sockette'

import {
  Toasts
} from './components'

import {
  actions,
} from "./store"

import { getCookie } from "./functions"

import {
  WS,
} from './mechanics'

import {
  FrontUser,
} from '@/types'

import {
  logout,
  onLogout,
} from './functions'
console.log('typeof window : ', typeof window)

/* import favicon from './assets/favicon.ico' */

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    //code for reloading on code change during development
    new Sockette('ws://localhost:5000/reloadws', {
      timeout: 5000,
      maxAttempts: 10,
      onreconnect: () => {
        window.location.reload()
      },
    })
  }, [])

  //let data: any = useLoaderData()

  useEffect(() => {
    (async () => {

      let k = window.key
      let secret = window.secret
      document.getElementById('scriptToDelete')?.remove()
      delete window.key
      delete window.secret
      //@ts-ignore
      const importedKey = await window.crypto.subtle.importKey('jwk', k, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt'])

      actions.auth.importedKey(importedKey)
      actions.auth.iv(new TextEncoder().encode(secret))
    })()
  }, [])

  useEffect(() => {
    //**effects is running only on client
    actions.app.isClient(true)
  }, [])

  useEffect(() => {
    try {
      let user_cookie = getCookie('user') as string

      const user = JSON.parse(decodeURIComponent(user_cookie))

      console.log('[app ] user : ', user)

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

  return (
    <PrimeReactProvider value={{
      appendTo: 'self',
      ripple: true,
    }}>
      <WS />
      <Outlet />

      <div className="logout" onClick={logout}>Logout</div>

      <Toasts />
    </PrimeReactProvider>
  )
}