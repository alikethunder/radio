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

  const [flag_url, set_flag_url] = useState<string | null>(null)

  useEffect(() => {
    if (en) {
      set_flag_url(encodeURIComponent(`/flags/${en}.webp`))
    }
  }, [en])

  return (
    <div
      className={`inline-block bg-no-repeat bg-contain bg-center ${className ?? ''}`}
      onClick={click}
      style={{
        width: '24px',
        height: '18px',
        ...flag_url ? { backgroundImage: `url(${flag_url})` } : {},
        ...style ?? {},
      }} />
  )
})