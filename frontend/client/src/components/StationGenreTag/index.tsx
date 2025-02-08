import { FC, memo, useCallback, useMemo } from "react"

import { classNames } from 'primereact/utils'

import { useDebounceCallback } from "usehooks-ts"

import {
  actions,
  store,
  useStore,
} from "@/store"
import { useLocation, useNavigate } from "react-router-dom"
import { tag_text_class } from '@/constants/classes'

type Props = {
  genre_en: string;
  onClick?: () => void;
  disable_link?: boolean;
}

export const StationGenreTag: FC<Props> = memo(({ genre_en, onClick, disable_link }) => {

  const { pathname } = useLocation()

  const genre = useStore().session.get_genre(genre_en)

  const search_selected_genres = useStore().persistedApp.search_selected_genres()

  const language = useStore().translations.language()

  const tag_is_in_search = useMemo(() => search_selected_genres.find(g => g.en == genre?.en), [search_selected_genres])

  const click = useCallback(useDebounceCallback((e) => {
    if (onClick) {
      onClick()
    }

    if (!disable_link && !tag_is_in_search) {

      if (genre) {
        actions.persistedApp.toggle_genre_search(genre)
      }

      actions.persistedApp.search_panel_closed(false)
    }
  }, 100), [pathname, genre, tag_is_in_search])

  return (
    <span
      onClick={click}

      className={classNames({
        'opacity-0': (genre?.color ?? 'nullish') != 'nullish' && !genre?.color?.length,
        'cursor-pointer shadow_on_hover shadow-2': !tag_is_in_search && !disable_link,
        'opacity-70': tag_is_in_search && !disable_link,
      },
        `py-05 select-none font-medium border-round inline-flex max-w-full ${tag_text_class}`,
      )}

      style={{
        color: genre?.color,
        backgroundColor: genre?.color,
        margin: '.125rem',
        padding: '.125rem .4rem',
      }}
    >
      <span className="value inline-block max-w-full overflow-hidden text-overflow-ellipsis white-space-nowrap " style={{
        color: 'white',
      }}>
        <span
          className="text-xl mr-1"
          style={{
            lineHeight: .875,
          }}
        >{genre?.icon}</span> {genre?.[language ?? 'en']}
      </span>
    </span>
  )
})