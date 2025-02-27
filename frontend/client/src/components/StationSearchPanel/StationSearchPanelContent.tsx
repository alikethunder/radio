import { ChangeEvent, FC, memo, useCallback, useEffect, } from "react"

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
import { StationCountry, } from "@/types"
import { StationCountryTag } from "../StationCountryTag"
import { GenreItemTemplate } from "@/layout parts"

import { multiselect_pt } from "@/constants/multiselect"

export const StationSearchPanelContent: FC = memo(() => {

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const search_selected_countries = useStore().persistedApp.search_selected_countries()

  const search_selected_languages = useStore().persistedApp.search_selected_languages()

  const search_selected_genres = useStore().persistedApp.search_selected_genres()

  const countries = useStore().session.station_countries()

  const station_languages = useStore().session.station_languages()

  const station_genres = useStore().session.station_genres()

  const language = useStore().translations.language()

  const [translations] = useTranslations([
    'search_radiostations',
    'country',
    'genre',
    "language",
    'no_genres_found',
    'no_countries_found',
    'no_languages_found',
  ], true)

  useEffect(() => {
    debounce(() => {

      const escaped = search_stations_text.replace(/\,/g, ' ').replace(/\-/g, ' ').replace(/\_/g, ' ').toLowerCase().split(' ').filter(w => !!w)

      actions.persistedApp.search_stations_text_array(escaped)
    }, 100)()
  }, [search_stations_text])

  const clear_input = useCallback(
    useDebounceCallback(() => actions.persistedApp.search_stations_text(''), 100)
    , [])

  const fav_loading = !useStore().app.stations_favorite_loaded()
  const home_loading = !useStore().app.stations_home_loaded()

  const text_search_in_progress = useStore().app.text_search_in_progress()

  const [home_page] = usePageInList([app_routes.root])
  const [fav_page] = usePageInList([app_routes.my_stations])

  const update_search = useCallback((e: ChangeEvent) => actions.persistedApp.search_stations_text((e.target as HTMLInputElement).value), [])

  const countryItemTemplate = useCallback((option: StationCountry) =>
    <StationCountryTag en={option.en} disable_link />
    , [])

  const change_countries = useCallback((e: MultiSelectChangeEvent) => {
    actions.persistedApp.search_selected_countries(e.value)
  }, [])

  const change_languages = useCallback((e: MultiSelectChangeEvent) => {
    actions.persistedApp.search_selected_languages(e.value)
  }, [])

  const change_genres = useCallback((e: MultiSelectChangeEvent) => {
    actions.persistedApp.search_selected_genres(e.value)
  }, [])

  const set_multiselect_ref = useCallback((e: MultiSelect) => {
    if (e) {
      const label = e.getElement().dataset["selectLabel"]
      //@ts-ignore
      actions.app[e.getElement().dataset["selectLabel"] + '_multiselect_ref'](e)
    }
  }, [])

  const genres_multiselect_ref = useStore().app.genres_multiselect_ref()

  const countries_multiselect_ref = useStore().app.countries_multiselect_ref()

  const languages_multiselect_ref = useStore().app.languages_multiselect_ref()

  /* useEffect(() => {
    if (genres_multiselect_ref) {
      genres_multiselect_ref.props.onHide = e => {
        console.log('genres multiselect hide  e : ', genres_multiselect_ref.getElement().querySelector('[role="searchbox"]'), genres_multiselect_ref.getElement().querySelector('[role="searchbox"]').value)

        genres_multiselect_ref.getElement().querySelector('[role="searchbox"]').value = ''
      }
    }
  }, [
    genres_multiselect_ref,
  ]) */

  return (
    <>

      <div className="flex flex-column w-full max-w-20rem gap-3">
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

        {/* Genres */}
        <MultiSelect
          value={search_selected_genres}
          onChange={change_genres}
          options={station_genres}
          optionLabel={language ?? 'en'}
          itemTemplate={GenreItemTemplate}
          display="chip"
          filter
          placeholder={translations.genre}
          className="w-20rem max-w-full relative"
          pt={multiselect_pt}
          ref={set_multiselect_ref}
          data-select-label="genres"
          emptyFilterMessage={translations.no_genres_found}
          showClear
        />

      </div>

      <div className="flex flex-column w-full max-w-20rem gap-3">
        {/* Countries */}
        <MultiSelect
          value={search_selected_countries}
          onChange={change_countries}
          options={countries}
          optionLabel={language ?? 'en'}
          itemTemplate={countryItemTemplate}
          display="chip"
          filter
          placeholder={translations.country}
          className="max-w-20rem w-full relative"
          pt={multiselect_pt}
          ref={set_multiselect_ref}
          data-select-label="countries"
          emptyFilterMessage={translations.no_countries_found}
          showClear
        />

        {/* Languages */}
        <MultiSelect
          value={search_selected_languages}
          onChange={change_languages}
          options={station_languages}
          optionLabel={language ?? 'en'}
          display="chip"
          filter
          placeholder={translations.language}
          className="w-20rem max-w-full relative"
          pt={multiselect_pt}
          ref={set_multiselect_ref}
          data-select-label="languages"
          emptyFilterMessage={translations.no_languages_found}
          showClear
        />

      </div>
    </>
  )
})