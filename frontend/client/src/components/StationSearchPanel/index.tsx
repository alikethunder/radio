import { FC, } from "react"

import { StationSearchPanelContent } from "./StationSearchPanelContent"

import {
  useStore,
} from "@/store"

import {
  useShowSearchPanel,
} from '@/hooks'

import './index.sass'

export const StationSearchPanel: FC = () => {

  const search_panel_closed = useStore().persistedApp.search_panel_closed()

  const [show_stations_search] = useShowSearchPanel()

  return (
    <div
      className={`search_panel z-1 flex flex-row flex-wrap p-2 gap-4 justify-content-center align-items-end transition-transform transition-duration-200 transition-ease-in-out ${show_stations_search ? '' : 'hidden'} ${search_panel_closed ? '-translate-y-100' : 'translate-y-0  shadow-2'}`}>
      <StationSearchPanelContent />
    </div>
  )
}