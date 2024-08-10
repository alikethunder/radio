import { useLocation, Navigate } from "react-router-dom"

import {
  app_routes,
} from '@/constants/router'

import {
  store,
  useStore,
} from "@/store"

import { useRestrictedPage } from '@/hooks'

import {
  auth_required_routes,
  auth_routes,
} from "@/constants/router"

export const RestrictedPage = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

  let location = useLocation()

  const signedin = useStore().auth.signedin()

  const [auth_page_is_restricted, checked_auth_page_is_restricted] = useRestrictedPage(auth_routes)

  const [auth_required_page_is_restricted, checked_auth_required_page_is_restricted] = useRestrictedPage(auth_required_routes)

  if (checked_auth_required_page_is_restricted && checked_auth_page_is_restricted) {
    if (
      signedin ? auth_page_is_restricted : auth_required_page_is_restricted
    ) {
      return <Navigate to={app_routes.root} state={{ from: location }} replace />
    }
    return children
  }
  return <></>
}