import React from "react"
import { redirect, RouteObject, } from "react-router-dom"
import App from "./App"

import {
  Signin,
  Signup,
  Verification,
  ResetPassword,
} from "./pages/auth"

import {
  Home,
  //Card,
  PurchasePlan,
  Project,
  UserProfile,
  Station,
} from '@/pages'

import {

} from '@/components'

import {
  actions,
  store
} from './store'

import {
  FrontUser,
} from '@/types'

import { CardPageParams } from "@/types/card"

import {
  app_routes,
} from '@/constants/router'

type Loader_params = { params: { [param: string]: string; }, request: Request }

export const routes = [
  {
    path: app_routes.root,
    loader() {
      return ''
    },
    element: <App />,
    children: [
      {
        path: app_routes.root,
        element: <Home />
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
        path: app_routes.project$id,
        element: <Project />,
        loader(
          {
            params,
            request,
          }: Loader_params
        ) {
          //console.log('project params : ', params)
          //todo: load project data from db

          //new project
          if (params.id == 'new') {
            return params.id
          }

          //if there is no such project
          return null
        }
      },
      {
        path: app_routes.station$id,
        element: <Station />,
        loader(
          {
            params,
            request,
          }: Loader_params
        ) {
          //console.log('station params : ', params)
          //todo: load station data from db

          //new station
          if (params.id == 'new') {
            return params.id
          }

          //if there is no such station
          return null
        },
        children: [
          {
            path: app_routes["station$id/edit"],
            element: <Station/>
          }
        ],
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