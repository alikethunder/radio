export const app_routes = {
  root: '/',
  signup: '/signup',
  signin: '/signin',
  reset_password: '/reset-password',
  verification: '/verification',
  purchase_plan: '/purchase-plan',
  project_id: '/project/:id',
}



//routes accessible for not authenticated users
export const unprotectedRoutes = [
  app_routes.signup,
  app_routes.signin,
  app_routes.reset_password,
  app_routes.verification,
  app_routes.purchase_plan,
  app_routes.root,
]