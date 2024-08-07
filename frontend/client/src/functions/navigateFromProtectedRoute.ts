import {
  createBrowserRouter,
} from "react-router-dom"

import {
  store,
} from "@/store"

import { unprotectedRoutes } from "@/constants/router"

//routes accessible for not authenticated users

export const navigateFromProtectedRoute = () => {

  const { navigate, state: { location: { pathname } } } = store.app.router() as ReturnType<typeof createBrowserRouter>

  if (!unprotectedRoutes.find(path => path.includes(pathname))) {
    navigate('/')
  }
}