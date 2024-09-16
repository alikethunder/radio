import { Station } from "@/types"
import { useLoaderData } from "react-router-dom"

/* 
routes transformation for name
        _ === -
        /$ === :
*/
export const app_routes = {
  root: '/',
  signup: '/signup',
  signin: '/signin',
  reset_password: '/reset-password',
  verification: '/verification',
  purchase_plan: '/purchase-plan',
  project$id: '/project/:id',
  user_profile$id: '/user-profile/:id',
  station$id: '/station/:id',
} as const

export const auth_required_routes = [
  app_routes.project$id,
  app_routes.user_profile$id,
] as const

export const auth_routes = [
  app_routes.signup,
  app_routes.signin,
  app_routes.reset_password,
  app_routes.verification,
]

//routes accessible for not authenticated users
export const unprotectedRoutes = [
  app_routes.root,
  app_routes.purchase_plan,
  ...auth_routes,
  app_routes.station$id,
] as const

export const all_routes = Object.values(app_routes)

export const route_attributes = {
  [app_routes.user_profile$id]: {
    name: 'Профиль',
    icon: 'pi-id-card'
  },
  [app_routes.signin]: {
    name: 'Вход',
    icon: 'pi-sign-in',
  },
  [app_routes.station$id]: {
    name: () => {
      const station = useLoaderData() as Station
      console.log(station)
      return station?.name
    }
  },
}