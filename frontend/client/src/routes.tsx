import React from "react"
import { redirect, } from "react-router-dom"
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
} from '@/pages'

import {

} from '@/components'

import {
  actions,
  store
} from '@/store'

import {
  FrontUser,
} from '@/types'

import { CardPageParams } from "@/types/card"

import {
  app_routes,
} from '@/constants/router'

import {
  list as stations_list,
} from '@/API/station/list'

import {
  get_station,
} from '@/API/station/get_station'

type Loader_params = { params: { [param: string]: string; }, request: Request }

export const routes = [
  {
    path: app_routes.root,
    element: <App />,
    loader() {
      //console.log('root loader')
      actions.app.current_page({})
      return null
    },
    shouldRevalidate: (/* o */) => {
      //console.log(o)
      return false
    },
    children: [
      {
        path: app_routes.root,
        loader: async ({ request }: Loader_params) => {

          const stations = await stations_list()
          return stations
          //return [...stations, ...stations, ...stations, ...stations]
        },
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
              own_profile: true,
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
          //todo: load station data from db
          const { id } = params

          if (id == 'new') {
            //new station

            const is_admin = store.user.admin()
            console.log('[loader Station] root admin : ', is_admin)
            if (!is_admin) {
              return redirect('/')
            }

            return {
              id,
            }
          }
          try {

            const station = await get_station(id)

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
        shouldRevalidate: () => false,
      },
      {
        path: app_routes.signin,
        element: <Signin />
      },
      {
        path: app_routes.signup,
        element: <Signup />
      },
      {
        path: app_routes.verification,
        element: <Verification />
      },
      {
        path: app_routes.reset_password,
        element: <ResetPassword />
      }
    ],
  },
]