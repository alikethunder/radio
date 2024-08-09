import { useLocation, Navigate } from "react-router-dom"

import { has_to_redirect } from "@/functions"

import {
  app_routes,
} from '@/constants/router'

export const AuthRequired = ({ children }: { children: JSX.Element }) => {

  let location = useLocation()

  if (has_to_redirect()) {
    return <Navigate to={app_routes.root} state={{ from: location }} replace />;
  } else {
    return children;
  }
}