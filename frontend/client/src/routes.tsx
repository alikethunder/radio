import React from "react"
import { json, useLoaderData, redirect, RouteObject } from "react-router-dom"
import App from "./App"

import {
  Signin,
  Signup,
  Verification,
  ResetPassword,
} from "./pages/auth"

import {
  actions,
  store
} from './store'

import {
  FrontUser,
} from '../types'

const IdElem = () => {
  const { id } = useLoaderData() as { id: string }
  return (<div >Id is {id}</div>)
}

export const routes = [
  {
    path: "/",
    loader() {
      return ''
    },
    element: <App />,
    children: [
      {
        path: '/:id',
        loader({ params }: { params: any }) {
          return { id: params.id }
        },
        element: <IdElem />
      },
      ...[
        {
        path: '/signin',
        element: <Signin />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/verification',
        element: <Verification />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      }].map((route: RouteObject)=>{
        route.loader = async ()=>{
          return store.auth.signedin() ? redirect('/home') : ''
        }
        return route
      })
    ],

  },
]