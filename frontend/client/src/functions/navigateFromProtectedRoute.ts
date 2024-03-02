import {
  createBrowserRouter,
} from "react-router-dom"

import {
  store,
} from "@/store"

const unprotectedRoutes = [
  '/signup',
  '/signin',
  '/reset-password',
  '/verification',
  '/purchase-plan',
]

//routes accessible for not authenticated users

export const navigateFromProtectedRoute = () => {

  const { navigate, state: { location: { pathname } } } = store.app.router() as ReturnType<typeof createBrowserRouter>

  if (!unprotectedRoutes.find(path => pathname.includes(path))) {
    navigate('/signin')
  }
}