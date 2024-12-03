import { FC, useCallback, useEffect, useMemo } from "react"

import { Tag } from 'primereact/tag'

import { classNames } from 'primereact/utils'

import { useDebounceCallback } from "usehooks-ts"

import {
  actions,
  store,
  useStore,
} from "@/store"
import { useLocation, useNavigate } from "react-router-dom"
import { all_routes, app_routes } from "@/constants/router"

type Props = {
  tag: string;
  color?: string;
  onClick?: () => void;
  disable_link?: boolean;
}

export const StationTag: FC<Props> = ({ tag, color, onClick, disable_link }) => {

  const navigate = useNavigate()

  const { pathname } = useLocation()

  const result_color = color ?? useStore().app.get_station_tag(tag)?.color

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const tag_is_in_search = useMemo(() => search_stations_text.includes(tag.toLowerCase()), [search_stations_text])

  const click = useCallback(useDebounceCallback((e) => {
    if (onClick) {
      onClick()
    }

    if (!disable_link) {

      actions.persistedApp.add_tag_to_search(tag)

      /* if (![
        app_routes.root,
        app_routes.my_stations
      ].includes(pathname as typeof all_routes[number])) {
        console.log('[StationTag]   navigate')
        navigate(app_routes.root)
      } */

      actions.persistedApp.search_panel_closed(false)
    }
  }, 100), [pathname])

  const raw_color = useMemo(() => result_color?.includes('#') || result_color?.includes('rgb'), [result_color])

  return (
    <Tag
      value={tag}
      onClick={click}
      pt={{
        root: {
          className: classNames({
            'opacity-0': (color ?? 'nullish') != 'nullish' && !color?.length,
            'cursor-pointer shadow_on_hover shadow-2': !tag_is_in_search && !disable_link,
          },
            'py-05',
            'select-none',
            color?.includes('surface')
              ? color :
              (
                raw_color ? '' : `bg-${result_color}`
              ),
            'text-sm',
            'font-medium',
            `${disable_link ? '' : (tag_is_in_search ? 'opacity-70' : '')}`
          ),
          style: {
            color: raw_color ? result_color : `var(--${result_color})`,
            ...raw_color ? {
              'background-color': result_color
            } : {},
          }
        },
        value: {
          className: classNames({

          },
          ),
          style: {
            lineHeight: 1.25,
            color: 'white',
          }
        }
      }}
    />
  )
}