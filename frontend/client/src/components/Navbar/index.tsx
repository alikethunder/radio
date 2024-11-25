import { FC, useMemo, } from "react"

import { Button } from 'primereact/button'

import { Badge } from 'primereact/badge'

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  useShowSearchPanel,
  useTranslations,
} from '@/hooks'

import {
  app_routes,
} from '@/constants/router'

import {
  FormActionsState,
  QueryLink,
} from '@/components'

import { icon_classes } from "@/constants/icon_classes"
import { useDebounceCallback } from "usehooks-ts"

import './index.sass'

export const Navbar: FC = () => {

  const current_page = useStore().app.current_page()

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const search_panel_collapsed = useStore().persistedApp.search_panel_collapsed()

  const search_button_badge_value = useMemo(() => search_station_tags.length, [search_station_tags,])

  const [show_stations_search] = useShowSearchPanel()

  const [translations] = useTranslations([
    'open_search_stations_panel',
  ], true)

  const click_search = useDebounceCallback((e) => {
    store.persistedApp.search_panel()?.toggle(e)
    actions.persistedApp.search_panel_collapsed(!store.persistedApp.search_panel_collapsed())
  }, 50)

  return (
    <>
      <div className="flex flex-shrink-0 shadow-2 h-3rem sm:h-4rem justify-content-between bg-white border-bottom-1 border-solid border-100 border-top-none border-left-none border-right-none">

        <div className="left h-full flex gap-1 sm:gap-2">

          <QueryLink to={app_routes.root}
            onClick={() => actions.session.rightSidebarOpened(false)}>
            <Button
              text
              raised
              className="flex flex-row gap-1 border-noround w-full h-full md:px-2 px-1  action_text_font text-xl shadow_on_hover md:text-3xl bangers-font logo-glow"
            >
              <span style={{
              }}>
                Radio
              </span>
              <img src="/favicon_120x120.png" />
              <span style={{
                //transform: 'skew(18deg, -10deg) translateY(-2px)'
              }}>Best</span>
            </Button>
          </QueryLink>

          <div className="action_text_font align-self-center text-primary max-h-full text-overflow-ellipsis text_hidden_overflow line-clamp-2 select-none sm:text-lg font-bold">
            {
              current_page?.icon ?
                <i className={`pi ${current_page?.icon} mr-2`}></i>
                : <></>
            }

            {
              current_page?.name ?? ''
            }
          </div>

          {
            show_stations_search ?
              <Button
                //icon={`pi pi-search-${search_panel_collapsed ? 'plus' : 'minus'}`}
                rounded
                outlined
                raised
                aria-label={translations.open_search_stations_panel}
                className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center`}
                severity={`info`}

                onClick={click_search}
              >
                <i className={`pi pi-search-${search_panel_collapsed ? 'plus' : 'minus'} p-overlay-badge`}>
                  <Badge
                    value={search_button_badge_value}
                    severity="warning"
                    style={{
                      fontSize: '0.6rem',
                      lineHeight: '.7rem',
                      height: '0.8rem',
                      width: '.8rem',
                      minWidth: '.8rem',
                      right: '.1rem',
                      top: '.1rem',
                      ...search_button_badge_value ? {} : {
                        display: 'none'
                      },
                    }}
                    className="p-0"
                  />
                </i>

              </Button>
              : <></>
          }
          <FormActionsState />

        </div>

        <div className="right h-full mr-0 md:mr-2">
          <Button
            className="h-full shadow-none"
            severity="info"
            text
            icon="pi pi-bars text-2xl md:text-3xl"
            onClick={() => actions.session.rightSidebarOpened(true)} />
        </div>
      </div>
    </>
  )
}