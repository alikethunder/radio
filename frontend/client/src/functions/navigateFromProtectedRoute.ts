import {
  createBrowserRouter,
  redirect,
} from "react-router-dom"

import {
  store,
} from "@/store"

import { unprotectedRoutes } from "@/constants/router"

export const navigateFromProtectedRoute = (path_to_check?: string) => {

  if (path_to_check) {
    //redirect in loader
    if (!unprotectedRoutes.find(path => path.includes(path_to_check))) {
      return redirect('/')
    }
  } else {
    const { navigate, state: { location: { pathname } } } = store.app.router() as ReturnType<typeof createBrowserRouter>

    if (!unprotectedRoutes.find(path => path.includes(pathname))) {
      navigate('/')
    }
  }


}