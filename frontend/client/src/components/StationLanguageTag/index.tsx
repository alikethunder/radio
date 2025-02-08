import { FC, memo, useCallback, useMemo } from "react"

import { classNames } from 'primereact/utils'

import { useDebounceCallback } from "usehooks-ts"
import { tag_text_class } from '@/constants/classes'

import {
  actions,
  useStore,
} from "@/store"

type Props = {
  language_en: string;
  onClick?: () => void;
  disable_link?: boolean;
  className?: string;
}

export const StationLanguageTag: FC<Props> = memo(({ language_en, onClick, disable_link, className }) => {

  const station_language = useStore().session.get_language(language_en)

  const search_selected_languages = useStore().persistedApp.search_selected_languages()

  const language = useStore().translations.language()

  const tag_is_in_search = useMemo(() => search_selected_languages.find(g => g.en == station_language?.en), [search_selected_languages])

  const click = useCallback(useDebounceCallback((e) => {
    if (onClick) {
      onClick()
    }

    if (!disable_link && !tag_is_in_search) {

      if (station_language) {
        actions.persistedApp.toggle_language_search(station_language)
      }

      actions.persistedApp.search_panel_closed(false)
    }
  }, 100), [station_language, tag_is_in_search])

  return (
    <span
      onClick={click}

      className={classNames({
        'cursor-pointer': !tag_is_in_search && !disable_link,
        'opacity-70': tag_is_in_search && !disable_link,
      },
        `select-none font-medium inline-block max-w-full overflow-hidden text-overflow-ellipsis white-space-nowrap text-primary ${tag_text_class} ${className ?? ''}`,
      )}
    >
      {station_language?.[language ?? 'en']}
    </span>
  )
})