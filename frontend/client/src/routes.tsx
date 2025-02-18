import React, { Profiler } from "react"
import { redirect, ShouldRevalidateFunctionArgs, } from "react-router-dom"
import App from "@/App"

import {
  Signin,
  Signup,
  Verification,
  ResetPassword,
} from "@/pages/auth"

import {
  Home,
  PurchasePlan,
  UserProfile,
  Station,
  FavoriteStations,
} from '@/pages'

import {
  actions,
  store
} from '@/store'

import {
  app_routes,
} from '@/constants/router'

import {
  list as stations_list,
} from '@/API/station/list'

import {
  get_station,
} from '@/API/station/get_station'
import { useFavoriteStations } from "./hooks"

type Loader_params = { params: { [param: string]: string; }, request: Request }

const auth_loader = () => {
  return {
    loader: ({
      params,
      request,
    }: Loader_params) => {
      //console.log('[auth_loader] params, request : ', params, request,)
      if (store.auth.signedin()) {
        //console.log('[auth_loader] redirect')
        return redirect(app_routes.root + new URL(request.url).search)
      }
      return null
    }
  }
}

let signedin = false

export const routes = [
  {
    path: app_routes.root,
    element: <Profiler id="App" onRender={(id, phase) => {
      console.log('App render, id , phase : ', id, phase)
    }}><App /></Profiler>,
    loader() {
      //console.log('root loader')
      actions.app.current_page({})
      return null
    },
    shouldRevalidate: () => {
      return false
    },
    children: [

      {
        path: app_routes.root,
        element: <Home />,
        shouldRevalidate: () => false,
      },

      {
        path: app_routes.purchase_plan,
        element: <PurchasePlan />
      },

      {
        path: app_routes.user_profile$id,
        element: <UserProfile />,
        loader(
          {
            params,
            request,
          }: Loader_params
        ) {
          //console.log('user_profile params : ', params, request)

          //own user profile
          if (params.id == store.user.id()) {
            return {
              id: params.id,
              name: store.user.name(),
              email: store.user.email(),
            }
          } else {
            //todo: load public user data from db

          }

          //if there is no such project
          return null
        },
      },

      {
        path: app_routes.station$id,
        element: <Station />,
        loader: async (
          {
            params,
            request,
          }: Loader_params
        ) => {
          //console.log('station params : ', params)
          const { id } = params

          if (id == 'new') {
            //new station

            const is_admin = store.user.admin()
            //console.log('[loader Station] root admin : ', is_admin)
            if (!is_admin) {
              return redirect('/')
            }

            return {
              id,
            }
          }
          try {

            const station = await get_station(id)

            if (!station) {
              throw new Error('station not found')
            }

            actions.app.current_page({
              name: station?.name
            })

            return station
          } catch (e) {
            console.log(`[router ${request.url}] error : `, e)

            //if there is no such station
            return redirect(app_routes.root)
          }

        },
        shouldRevalidate: ({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) => currentUrl.pathname !== nextUrl.pathname,
      },

      {
        path: app_routes.my_stations,
        element: <FavoriteStations />,
        loader: async (
          {
            params,
            request,
          }: Loader_params
        ) => {
          const favorite_stations = useFavoriteStations(true)

          if (!favorite_stations.length) {
            return redirect(app_routes.root)
          }
          return null
        },
        shouldRevalidate: () => false,
      },

      {
        path: app_routes.signin,
        ...auth_loader(),
        element: <Signin />,
        /* shouldRevalidate: (data) => {
          console.log('[Signin] shouldRevalidate data : ', store.auth.signedin(), data)
          if (signedin == store.auth.signedin()) {
            return false
          } else {
            signedin = store.auth.signedin()
            return true
          }
        }, */
      },
      {
        path: app_routes.signup,
        ...auth_loader(),
        element: <Signup />,
      },
      {
        path: app_routes.verification,
        ...auth_loader(),
        element: <Verification />,
      },
      {
        path: app_routes.reset_password,
        ...auth_loader(),
        element: <ResetPassword />,
      }
    ],
  },
]