import {
  createBrowserRouter,
  redirect,
} from "react-router-dom"

import {
  store,
} from "@/store"

import {
  app_routes,
} from '@/constants/router'

import { has_to_redirect } from "@/functions"

export const navigateFromProtectedRoute = (path_to_check?: string) => {

  const { navigate } = store.app.router() as ReturnType<typeof createBrowserRouter>

  if (has_to_redirect()) {
    navigate(app_routes.root)
  }
}