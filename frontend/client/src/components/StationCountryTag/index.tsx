import { CSSProperties, FC, memo, useCallback, useEffect, useMemo, useState } from "react"

import { classNames } from 'primereact/utils'

import { useDebounceCallback } from "usehooks-ts"
import { tag_text_class } from '@/constants/classes'

import {
  actions,
  useStore,
} from "@/store"
import { useLog } from "@/hooks"
import { StationCountryFlag } from "../StationCountryFlag"

type Props = {
  en: string;
  onClick?: () => void;
  disable_link?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const StationCountryTag: FC<Props> = memo(({ en, style, onClick, disable_link, className }) => {

  const station_country = useStore().session.get_country(en)

  const search_selected_countries = useStore().persistedApp.search_selected_countries()

  const language = useStore().translations.language()

  const tag_is_in_search = useMemo(() => search_selected_countries.find(g => g.en == station_country?.en), [search_selected_countries])

  const click = useCallback(useDebounceCallback((e) => {
    if (onClick) {
      onClick()
    }

    if (!disable_link && !tag_is_in_search) {

      if (station_country) {
        actions.persistedApp.toggle_country_search(station_country)
      }

      actions.persistedApp.search_panel_closed(false)
    }
  }, 100), [station_country, tag_is_in_search])

  return (
    <span
      onClick={click}

      className={classNames({
        'cursor-pointer': !tag_is_in_search && !disable_link,
        'opacity-70': tag_is_in_search && !disable_link,
      },
        `inline-block align-items-center font-semibold select-none max-w-full overflow-hidden text-overflow-ellipsis white-space-nowrap text-primary ${tag_text_class} ${className ?? ''}`,
      )}
      style={{
        fontSize: '1rem',
      }}
    >
      <StationCountryFlag en={en} className="inline-block mr-1" style={{
        verticalAlign: 'middle'
      }} />

      <span style={{
        verticalAlign: 'middle'
      }}>{station_country?.[language ?? 'en']}</span>
    </span>
  )
})