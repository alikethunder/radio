import { FC, useCallback, useMemo } from "react"

import { classNames } from 'primereact/utils'

import { useDebounceCallback } from "usehooks-ts"

import {
  actions,
  store,
  useStore,
} from "@/store"
import { useLocation, useNavigate } from "react-router-dom"

type Props = {
  tag: string;
  color?: string;
  onClick?: () => void;
  disable_link?: boolean;
}

export const StationTag: FC<Props> = ({ tag, color, onClick, disable_link }) => {

  const { pathname } = useLocation()

  const result_color = color ?? useStore().app.get_station_tag(tag)?.color

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const tag_is_in_search = useMemo(() => search_stations_text.includes(tag.toLowerCase()), [search_stations_text])

  const click = useCallback(useDebounceCallback((e) => {
    console.log(e, tag)
    if (onClick) {
      onClick()
    }

    if (!disable_link) {

      actions.persistedApp.add_tag_to_search(e.target.textContent)

      actions.persistedApp.search_panel_closed(false)
    }
  }, 100), [pathname])

  const raw_color = useMemo(() => result_color?.includes('#') || result_color?.includes('rgb'), [result_color])

  return (
    <span
      onClick={click}

      className={classNames({
        'opacity-0': (color ?? 'nullish') != 'nullish' && !color?.length,
        'cursor-pointer shadow_on_hover shadow-2': !tag_is_in_search && !disable_link,
        'opacity-70': tag_is_in_search && !disable_link,
      },
        `py-05 select-none text-sm font-medium border-round inline-flex 
        ${color?.includes('surface')
          ? color :
          (
            raw_color ? '' : `bg-${result_color}`
          )}`,
      )}

      style={{
        color: raw_color ? result_color : `var(--${result_color})`,
        ...raw_color ? {
          'background-color': result_color
        } : {},
        margin: '.125rem',
        padding: '.125rem .4rem',
      }}
    >
      <span className="value" style={{
        lineHeight: 1.25,
        color: 'white',
      }}>
        {tag}
      </span>
    </span>
  )
}