import { FC, memo, useCallback, useEffect, useMemo, useState, } from "react"

import { StationSearchPanelContent } from "./StationSearchPanelContent"

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  useShowSearchPanel,
} from '@/hooks'
import { hide_multiselects } from "@/functions"

const transition_classes = 'transition-all transition-duration-200 transition-linear'

export const StationSearchPanel: FC = memo(() => {

  const search_panel_closed = useStore().persistedApp.search_panel_closed()

  const [container_ref, set_container_ref] = useState<HTMLDivElement | null>(null)

  const set_c_ref = useCallback((e: HTMLDivElement | null) => {
    set_container_ref(e)
  }, [])

  const [show_stations_search] = useShowSearchPanel()

  const search_panel_opened = useMemo(() => !search_panel_closed && show_stations_search, [search_panel_closed, show_stations_search])

  useEffect(() => {
    if (container_ref) {
      let touch_start: number | null

      const touch_start_f = (e: TouchEvent) => {
        touch_start = e.changedTouches[0].clientY
      }

      const touch_move_f = (e: TouchEvent) => {
        if (
          touch_start
          && (
            (
              (e.target as HTMLElement).className.split && (e.target as HTMLElement).className.split(' ').includes('p-multiselect')
            )

            || (e.target as HTMLElement).closest('.p-multiselect-label-container')

            || (e.target as HTMLElement).closest('.p-multiselect-trigger')

            || (!(e.target as HTMLElement).className.includes('p-multiselect')

              && !(e.target as HTMLElement).closest('.p-multiselect')
            )
          )
        ) {
          e.stopImmediatePropagation()
          e.stopPropagation()

          actions.persistedApp.search_panel_closed(e.changedTouches[0].clientY < touch_start);

          hide_multiselects()
        }
      }

      container_ref.addEventListener('touchstart', touch_start_f)

      container_ref.addEventListener('touchmove', touch_move_f)

      return () => {
        container_ref.removeEventListener('touchstart', touch_start_f)
        container_ref.removeEventListener('touchmove', touch_move_f)
      }
    }
  }, [container_ref])

  return (
    <div
      className={`${transition_classes} ${search_panel_opened ? 'max-h-full' : 'max-h-0'}`}
      ref={set_c_ref}
    >
      <div
        className={`search_panel relative z-1 surface-card flex flex-row flex-wrap flex-shrink-0 p-2 gap-3 justify-content-center align-items-center ${transition_classes} ${search_panel_opened ? 'translate-y-0  shadow-2' : '-translate-y-100 -mb-7'}`}>
        <StationSearchPanelContent />
      </div>
    </div>
  )
})