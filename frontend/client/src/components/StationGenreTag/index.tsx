import { FC, memo, useCallback, useMemo } from "react"

import { classNames } from 'primereact/utils'

import { useDebounceCallback } from "usehooks-ts"

import {
  actions,
  store,
  useStore,
} from "@/store"
import { useLocation, useNavigate } from "react-router-dom"
import { StationGenre } from "@/types"

type Props = {
  genre: StationGenre;
  onClick?: () => void;
  disable_link?: boolean;
}

export const StationGenreTag: FC<Props> = memo(({ genre, onClick, disable_link }) => {

  const { pathname } = useLocation()

  const search_selected_genres = useStore().persistedApp.search_selected_genres()

  const language = useStore().translations.language()

  const tag_is_in_search = useMemo(() => search_selected_genres.find(g => g.en == genre.en), [search_selected_genres])

  const click = useCallback(useDebounceCallback((e) => {
    if (onClick) {
      onClick()
    }

    if (!disable_link) {

      /* actions.persistedApp.add_tag_to_search(e.target.textContent)

      actions.persistedApp.search_panel_closed(false) */
    }
  }, 100), [pathname])

  return (
    <span
      onClick={click}

      className={classNames({
        'opacity-0': (genre.color ?? 'nullish') != 'nullish' && !genre.color?.length,
        'cursor-pointer shadow_on_hover shadow-2': !tag_is_in_search && !disable_link,
        'opacity-70': tag_is_in_search && !disable_link,
      },
        `py-05 select-none text-sm font-medium border-round inline-flex`,
      )}

      style={{
        color: genre.color,
        backgroundColor: genre.color,
        margin: '.125rem',
        padding: '.125rem .4rem',
      }}
    >
      <span className="value inline-flex align-items-center justify-content-center" style={{
        lineHeight: 1.25,
        color: 'white',
        fontSize: '16px',
      }}>
        <span className="text-xl mr-1">{genre?.icon}</span> {genre?.[language ?? 'en']}
      </span>
    </span>
  )
})