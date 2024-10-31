/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import './sentry'
import 'vite/modulepreload-polyfill'

import 'promise-polyfill'

import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom"

import { routes } from "./routes"

import {
  actions
} from './store'

const router = createBrowserRouter(routes as RouteObject[], {
  basename: '/'
})

actions.app.router(router)

//hydrateRoot(document.getElementById("app")!, routerProvider)

createRoot(document.getElementById("app")!).render(<RouterProvider router={router} />)
