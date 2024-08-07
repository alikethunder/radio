import {
  createBrowserRouter,
  redirect,
} from "react-router-dom"

import {
  store,
} from "@/store"

import { unprotectedRoutes } from "@/constants/router"

export const has_to_redirect = (path_to_check: string) => {
  
  const { navigate, state: { location: { pathname } } } = store.app.router() as ReturnType<typeof createBrowserRouter>

  const p = path_to_check ?? pathname

  return !store.auth.signedin() && !unprotectedRoutes.find(path => path.includes(p))
}