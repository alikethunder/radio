import { FC, memo, useCallback, useMemo, } from "react"

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
  ThemeSwitcher,
  YandexAd,
} from '@/components'

import { useDebounceCallback } from "usehooks-ts"

import './index.sass'

export const Navbar: FC = memo(() => {

  const current_page = useStore().app.current_page()

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const search_selected_countries = useStore().persistedApp.search_selected_countries()

  const search_selected_languages = useStore().persistedApp.search_selected_languages()

  const search_selected_genres = useStore().persistedApp.search_selected_genres()

  const show_search_badge = useMemo(() => search_stations_text.length
    || search_selected_countries.length
    || search_selected_languages.length
    || search_selected_genres.length, [
    search_stations_text.length,
    search_selected_countries.length,
    search_selected_languages.length,
    search_selected_genres.length,
  ])

  const search_panel_closed = useStore().persistedApp.search_panel_closed()

  const [show_stations_search] = useShowSearchPanel()

  const [translations] = useTranslations([
    'open_search_stations_panel',
  ], true)

  const click_search = useDebounceCallback((e) => {
    actions.persistedApp.search_panel_closed(!store.persistedApp.search_panel_closed())
  }, 50)

  const click_root = useCallback(
    useDebounceCallback(() => actions.session.rightSidebarOpened(false), 50)
    , [])

  const open_rsb = useCallback(
    useDebounceCallback(
      () => actions.session.rightSidebarOpened(true)
      , 50)
    , [])

  return (
    <>
      <div className={`flex flex-row flex-shrink-0 h-3rem sm:h-4rem justify-content-between surface-card z-2 ${search_panel_closed ? 'shadow-2' : ''}`}
        style={{
          borderBottom: '1px solid var(--surface-border)',
        }}>

        <div className="left h-full flex gap-1 sm:gap-2 md:flex-shrink-0">

          <QueryLink to={app_routes.root}
            onClick={click_root}
            style={{
              borderRight: '1px solid var(--surface-border)',
            }}
          >
            <Button
              text
              raised
              className="flex flex-row gap-1 border-noround w-full h-full md:px-2 px-1  action_text_font text-xl shadow_on_hover md:text-3xl bangers-font logo-glow shadow-none border-none"
            >
              <span>Radio</span>
              <img src="/favicon_120x120.png" className="h-3rem sm:h-4rem w-3rem sm:w-4rem" loading="lazy"
                style={{
                  opacity: 0,
                  transition: 'opacity .3s ease'
                }}

                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '1'
                }} />
              <span>Best</span>
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
                rounded
                outlined
                raised
                aria-label={translations.open_search_stations_panel}
                tooltip={translations.open_search_stations_panel}
                className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center`}
                severity={`info`}

                onClick={click_search}
              >
                <i className={`pi pi-search-${search_panel_closed ? 'plus' : 'minus'} p-overlay-badge`}>
                  <Badge
                    severity="warning"
                    style={{
                      height: '0.5rem',
                      width: '.5rem',
                      minWidth: '.5rem',
                      right: '0.25rem',
                      top: '0.075rem',
                      ...show_search_badge ? {} : {
                        display: 'none'
                      },
                    }}
                    className="p-0"
                  />
                </i>

              </Button>
              : <></>
          }
          <ThemeSwitcher />
          <FormActionsState />

        </div>

        <YandexAd id="R-A-14083703-6" className="flex-grow-1 align-self-stretch ml-1" onlyDesktop />

        <div className="right h-full mr-0 md:mr-2 md:flex-shrink-0">
          <Button
            className="h-full shadow-none"
            severity="info"
            text
            icon="pi pi-bars text-2xl md:text-3xl"
            onClick={open_rsb} />
        </div>
      </div>
    </>
  )
})