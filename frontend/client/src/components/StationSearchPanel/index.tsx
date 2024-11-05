import { FC, LegacyRef, useCallback, useEffect, } from "react"

import { StationSearchPanelContent } from "./StationSearchPanelContent"

import { Panel } from 'primereact/panel'

import { classNames } from 'primereact/utils'

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  usePageInList,
} from '@/hooks'

import {
  app_routes,
} from '@/constants/router'

import { useSearchParams } from "react-router-dom"

import './index.sass'

export const StationSearchPanel: FC = () => {

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const search_panel_collapsed = useStore().persistedApp.search_panel_collapsed()

  const [show_stations_search] = usePageInList([app_routes.root, app_routes.station$id])

  const [searchParams, set_search] = useSearchParams()

  useEffect(() => {
    //add tags from url at starts
    const tags = searchParams.get('tags')?.split(',')
    if (tags?.length) {
      tags?.forEach(tag => { if (tag) actions.persistedApp.add_tag_to_search(tag) })
      actions.persistedApp.search_panel_collapsed(false)
      //@ts-ignore
      store.persistedApp.search_panel()?.expand()
    }
  }, [])

  useEffect(() => {
    set_search(s => {
      s.set('tags', search_station_tags.join(','))
      return s
    })
  }, [search_station_tags])

  const panel_ref = useCallback((e: Panel) => {
    if (e) actions.persistedApp.search_panel(e)
  }, [])

  return (
    <Panel
      ref={panel_ref}
      toggleable

      collapsed={search_panel_collapsed}

      pt={{
        root: {
          className: classNames({
            'hidden': !show_stations_search,
          },
          )
        },
        header: {
          style: {
            display: 'none'
          }
        },
        toggleableContent: {
          //panel content
          className: classNames({},
            'shadow-2',
          )
        },
        content: {
          //panel content
          className: classNames({},
            'flex',
            'flex-row',
            'flex-wrap',
            'p-2',
            'gap-4',
            'justify-content-center',
            'align-items-end',
          )
        }
      }}
    >
      <StationSearchPanelContent />
    </Panel >
  )
}