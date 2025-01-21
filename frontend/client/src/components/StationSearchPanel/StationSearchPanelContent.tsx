import { FC, memo, useCallback, useEffect, } from "react"

import { InputText } from "primereact/inputtext"

import { IconField } from "primereact/iconfield"

import { InputIcon } from "primereact/inputicon"

import debounce from 'lodash.debounce'

import {
  actions,
  useStore,
} from "@/store"

import {
  useLog,
  usePageInList,
  useTranslations,
} from '@/hooks'

import { useDebounceCallback } from "usehooks-ts"
import { app_routes } from "@/constants/router"

export const StationSearchPanelContent: FC = memo(() => {

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const [translations] = useTranslations([
    'search_radiostations',
  ], true)

  useEffect(() => {
    debounce(() => {
      actions.persistedApp.search_stations_text_array(
        search_stations_text.replaceAll(',', '').replaceAll('-', ' ').replaceAll('_', '').toLowerCase().split(' ').filter(w => !!w)
      )
    }, 100)()
  }, [search_stations_text])

  const clear_input = useCallback(
    useDebounceCallback(() => actions.persistedApp.search_stations_text(''), 100)
    , [])

  const fav_loading = !useStore().session.stations_favorite_loaded()
  const home_loading = !useStore().session.stations_home_loaded()

  const text_search_in_progress = useStore().app.text_search_in_progress()

  const [home_page] = usePageInList([app_routes.root])
  const [fav_page] = usePageInList([app_routes.my_stations])

  return (
    <>
      <div className="max-w-full w-20rem flex flex-column justify-content-center gap-1 align-self-stretch">

        {/* text search */}
        <IconField className="w-full align-self-start">

          {
            (
              fav_loading
              && fav_page
            )
              || (
                home_loading
                && home_page
              )
              || text_search_in_progress
              ?
              <InputIcon className="pi pi-spinner pi-spin" style={{
                ...search_stations_text ? {
                  right: '2rem',
                } : {},
              }} />
              : <></>
          }

          {
            search_stations_text ?
              <InputIcon className="pi pi-times cursor-pointer" onClick={clear_input} />
              : <></>
          }

          <InputText
            placeholder={translations.search_radiostations}
            className="w-full"
            value={search_stations_text}

            onChange={(e) => actions.persistedApp.search_stations_text(e.target.value)}
          />

        </IconField>

      </div>

    </>
  )
})