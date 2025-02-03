import { FC, memo, useMemo, } from "react"

import { StationSearchPanelContent } from "./StationSearchPanelContent"

import {
  useStore,
} from "@/store"

import {
  useShowSearchPanel,
} from '@/hooks'

export const StationSearchPanel: FC = memo(() => {

  const search_panel_closed = useStore().persistedApp.search_panel_closed()

  const [show_stations_search] = useShowSearchPanel()

  const search_panel_opened = useMemo(() => !search_panel_closed && show_stations_search, [search_panel_closed, show_stations_search])

  return (
    <div className={`transition-all transition-duration-200 transition-ease-in-out ${search_panel_opened ? 'max-h-full' : 'max-h-0'}`}>
      <div
        className={`search_panel z-1 surface-card flex flex-row flex-wrap flex-shrink-0 p-2 gap-3 justify-content-center align-items-center transition-all transition-duration-200 transition-ease-in-out ${search_panel_opened ? 'translate-y-0  shadow-2' : '-translate-y-100 -mb-7'}`}>
        <StationSearchPanelContent />
      </div>
    </div>
  )
})