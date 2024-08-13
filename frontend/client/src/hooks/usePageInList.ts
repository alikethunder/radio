import { useCallback, useEffect, useState } from "react"
import { matchPath, useLocation, PathMatch, } from "react-router-dom"

import {
  app_routes,
  all_routes,
} from '@/constants/router'

/* 
checks if the page is auth page and returns its match if it's one,
or null | undefined if it's not
*/
export const usePageInList = (pages: typeof all_routes, path_to_check?: string): [PathMatch<string> | string | null | undefined, boolean] => {

  const { pathname } = useLocation()

  const p = path_to_check ?? pathname

  const [match, set_match] = useState<PathMatch<string> | string | null | undefined>(null)

  const [checked_page, set_checked_page] = useState(false)

  useEffect(() => {
    set_match(pages.find(path => matchPath(path, p)))
    set_checked_page(true)
  }, [p])

  return [match, checked_page]
}