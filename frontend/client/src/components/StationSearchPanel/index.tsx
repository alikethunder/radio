import { FC, useCallback, useEffect, } from "react"

import { StationSearchPanelContent } from "./StationSearchPanelContent"

import { Panel } from 'primereact/panel'

import { classNames } from 'primereact/utils'

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  useShowSearchPanel,
} from '@/hooks'

import {
  app_routes,
} from '@/constants/router'

import { useSearchParams } from "react-router-dom"

import './index.sass'

export const StationSearchPanel: FC = () => {

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const search_panel_closed = useStore().persistedApp.search_panel_closed()

  const [show_stations_search] = useShowSearchPanel()

  const [searchParams, set_search] = useSearchParams()

  useEffect(() => {
    //add tags from url at starts
    const tags = searchParams.get('tags')?.split(',').filter(tag => !!tag)
    if (tags?.length) {
      tags?.forEach(tag => { if (tag) actions.persistedApp.add_tag_to_search(tag) })
      actions.persistedApp.search_panel_closed(false)
    }
  }, [])

  useEffect(() => {
    set_search(s => {
      if (search_station_tags.length) {
        s.set('tags', search_station_tags.join(','))
      } else {
        s.delete('tags')
      }
      return s
    })
  }, [search_station_tags])

  return (
    <div
      //ref={panel_ref}
      className={`search_panel z-1 flex flex-row flex-wrap p-2 gap-4 justify-content-center align-items-end transition-transform transition-duration-200 transition-ease-in-out ${show_stations_search ? '' : 'hidden'} ${search_panel_closed ? '-translate-y-100' : 'translate-y-0  shadow-2'}`}>
      <StationSearchPanelContent />
    </div>
  )
}