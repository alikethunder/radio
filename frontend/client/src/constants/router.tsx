import { Station } from "@/types"
import { useLoaderData } from "react-router-dom"

import { Translation } from "@/layout parts"

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
  user_profile$id: '/user-profile/:id',
  station$id: '/station/:id',
  my_stations: '/my-stations',
} as const

export const auth_required_routes = [
  //app_routes.user_profile$id,
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
  app_routes.my_stations,
  ...auth_routes,
  app_routes.station$id,
] as const

export const all_routes = Object.values(app_routes)

export const route_attributes = {
  [app_routes.user_profile$id]: {
    name: <Translation capitalize field="profile" className="w-5rem" /> as unknown as string,
    icon: 'pi-id-card',
  },
  [app_routes.signin]: {
    name: <Translation capitalize field="login" className="w-8rem" /> as unknown as string,
    icon: 'pi-sign-in',
  },
  [app_routes.signup]: {
    name: <Translation capitalize field="registration" className="w-8rem" /> as unknown as string,
    icon: 'pi-address-book',
  },
  [app_routes.reset_password]: {
    name: <Translation capitalize field="reset_password" className="w-8rem" /> as unknown as string,
    icon: 'pi-key',
  },
  [app_routes.verification]: {
    name: <Translation capitalize field="create_password" className="w-8rem" /> as unknown as string,
    icon: 'pi-verified',
  },
  [app_routes.root]: {},
  [app_routes.my_stations]: {
    name: <Translation capitalize field="my_stations" className="w-5rem" /> as unknown as string,
    icon: 'pi-star',
  },
} as const