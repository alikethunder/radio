import { FC, memo, } from "react"

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

  return (
    <div
      className={`search_panel z-1 surface-card flex flex-row flex-wrap flex-shrink-0 p-2 gap-4 justify-content-center align-items-end transition-all transition-duration-200 transition-ease-in-out h-4rem ${search_panel_closed || !show_stations_search ? '-translate-y-100 -mb-7' : 'translate-y-0  shadow-2'}`}>
      <StationSearchPanelContent />
    </div>
  )
})