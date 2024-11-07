import { useCallback, useEffect, useState } from "react"
import { matchPath, useLocation, PathMatch, } from "react-router-dom"

import {
  app_routes,
  all_routes,
} from '@/constants/router'

import { useLog } from "@/hooks/useLog"

/* 
checks if the page is in list of pages and returns its match if it's one,
or null | undefined if it's not
*/
export const usePageInList = (pages: readonly typeof all_routes[number][], path_to_check?: string | null, log?: boolean | null): [match: PathMatch<string> | string | null | undefined, checked: boolean] => {

  const { pathname } = useLocation()

  let p = (path_to_check ?? pathname)

  p = p.slice(0, -1) + (p.slice(-1) == '/' && p.length > 1 ? '' : p.slice(-1))

  const [match, set_match] = useState<PathMatch<string> | string | null | undefined>(null)

  const [checked_page, set_checked_page] = useState(false)

  useEffect(() => {
    //drop before new check
    set_checked_page(false)
    set_match(null)

    setTimeout(() => {
      set_match(m => {
        const page = pages.find(path => matchPath(path, p))
        set_checked_page(true)
        return page
      })
    }, 0)
  }, [p, pathname])

  useLog(log, '[usePageInList] pages, p, typeof p, match, checked_page : ', pages, p, typeof p, match, checked_page)

  return [match, checked_page]
}