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
} from '@/pages'

import {
  AuthRequired,
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
        path: app_routes.project_id,
        element: <AuthRequired><Project /></AuthRequired>,
        loader(
          {
            params,
            request,
          }: Loader_params
        ) {
          console.log('project params : ', params)
          //todo: load project data from db

          //new project
          if (params.id == 'new') {
            return params.id
          }

          //if there is no such project
          return null
        }
      },
      ...[
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
      ].map((route: RouteObject) => {
        route.loader = async () => {
          return store.auth.signedin() ? redirect('/') : ''
        }
        return route
      })
    ],

  },
]