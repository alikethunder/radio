

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
}

export const protected_routes = [
  app_routes.project$id,
]

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
]