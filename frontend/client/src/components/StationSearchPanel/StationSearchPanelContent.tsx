import { ChangeEvent, FC, memo, useCallback, useEffect, useState, } from "react"

import { InputText } from "primereact/inputtext"

import { IconField } from "primereact/iconfield"

import { InputIcon } from "primereact/inputicon"

import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'

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
import { StationCountry } from "@/types"

export const StationSearchPanelContent: FC = memo(() => {

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const search_selected_countries = useStore().persistedApp.search_selected_countries()

  const countries = useStore().session.station_countries()

  const language = useStore().translations.language()

  const [translations] = useTranslations([
    'search_radiostations',
    'filter_by_countries',
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

  const update_search = useCallback((e: ChangeEvent) => actions.persistedApp.search_stations_text((e.target as HTMLInputElement).value), [])

  const countryItemTemplate = useCallback((option: StationCountry) => <div className="flex flex-row align-items-center gap-1"><span className="text-2xl">{option?.flag}</span> {option?.[language ?? 'en']}</div>
    , [language])

  const change_countries = useCallback((e: MultiSelectChangeEvent) => {
    actions.persistedApp.search_selected_countries(e.value)
  }, [])

  return (
    <>
      {/* text search */}
      <IconField className="max-w-20rem w-full">

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

          onChange={update_search}
        />

      </IconField>

      {/* Countries */}
      <MultiSelect
        value={search_selected_countries}
        onChange={change_countries}
        options={countries}
        optionLabel={language ?? 'en'}
        itemTemplate={countryItemTemplate}
        display="chip"
        filter
        placeholder={translations.filter_by_countries}
        className="max-w-20rem w-full relative" />

    </>
  )
})