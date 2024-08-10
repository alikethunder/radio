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
          console.log('user_profile params : ', params)
          //todo: load project data from db

          //own user profile
          if (params.id == store.user.id()) {
            //return store.user.id()
          }

          //if there is no such project
          return null
        }
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