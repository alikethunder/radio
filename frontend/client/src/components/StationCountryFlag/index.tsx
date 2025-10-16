import { CSSProperties, FC, memo, useCallback, useEffect, useMemo, useState } from "react"

import { useDebounceCallback } from "usehooks-ts"

import {
  actions,
  useStore,
} from "@/store"
import { useLog } from "@/hooks"

type Props = {
  en: string;
  onClick?: () => void;
  disable_link?: boolean;
  className?: string;
  style?: CSSProperties;
}
import './index.sass'

export const StationCountryFlag: FC<Props> = memo(({ en, style, onClick, disable_link, className }) => {

  const station_country = useStore().session.get_country(en)

  const search_selected_countries = useStore().persistedApp.search_selected_countries()

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
    <div
      className={`inline-block bg-no-repeat bg-contain bg-center country_flag ${className ?? ''}`}
      onClick={click}
      style={{
        ...en ? { backgroundImage: `url(${encodeURI(`/flags/${en}.webp`)})` } : {},
        ...style ?? {},
      }} />
  )
})