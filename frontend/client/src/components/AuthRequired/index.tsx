import { useLocation, Navigate } from "react-router-dom"

import { has_to_redirect } from "@/functions"

export const AuthRequired = ({ children }: { children: JSX.Element }) => {

  let location = useLocation()

  if (has_to_redirect()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return children;
  }
}