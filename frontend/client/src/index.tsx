/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import 'vite/modulepreload-polyfill'

import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import { routes } from "./routes"

import {
  actions
} from './store'

const router = createBrowserRouter(routes, {
  basename: '/'
})

actions.app.router(router)

const routerProvider = <RouterProvider router={router} />

//hydrateRoot(document.getElementById("app")!, routerProvider)

createRoot(document.getElementById("app")!).render(routerProvider)
