import { useEffect, useMemo, useState, useTransition, } from "react"

import { actions, useStore } from "@/store"
import { Station } from "@/types"
import { useLog } from "./useLog";

const get_en = (obj: { en: string; }) => obj.en

export const useStationsSearch = (stations: Station[]) => {

  const search_stations_text_array = useStore().persistedApp.search_stations_text_array()

  const language = useStore().translations.language()

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const root_admin = useStore().user.admin()

  const current_user_id = useStore().user.id()

  const search_selected_countries = useStore().persistedApp.search_selected_countries()

  const search_selected_languages = useStore().persistedApp.search_selected_languages()

  const search_selected_genres = useStore().persistedApp.search_selected_genres()

  //useLog(true, '[useStationsSearch] search_selected_languages, search_selected_genres : ', search_selected_languages, search_selected_genres)

  const countries = useMemo(() => search_selected_countries.map(get_en), [search_selected_countries])

  const languages = useMemo(() => search_selected_languages.map(get_en), [search_selected_languages])

  const genres = useMemo(() => search_selected_genres.map(get_en), [search_selected_genres])

  //useLog(true, '[useStationsSearch] languages, genres : ', languages, genres)

  const [searched_stations_with_mode, set_searched_stations_with_mode] = useState(stations)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      const text_searched_stations = search_stations_text_array.length ?
        stations?.filter(
          station => search_stations_text_array.every(
            word =>
              (station[`description_${language}`] ?? '').toLowerCase().includes(word)
              || (station.name ?? '').toLowerCase().includes(word)
              || station.tags.some(tag => tag.toLowerCase().includes(word))
          )
        )
        : stations

      const admin_filtered = edit_mode ?
        (
          root_admin ?
            text_searched_stations
            :
            text_searched_stations.filter(station => current_user_id && station.admins?.includes(current_user_id))
        )
        :
        text_searched_stations?.filter(station => station.broadcasting)

      const country_filtered = countries.length ? admin_filtered.filter(station => countries.includes(station.country)) : admin_filtered

      const language_filtered = languages.length ? country_filtered.filter(station => station.languages?.find(lang => languages.includes(lang))) : country_filtered

      const genre_filtered = genres.length ? language_filtered.filter(station => station.genres?.find(genre => genres.includes(genre))) : language_filtered

      set_searched_stations_with_mode(genre_filtered)
    })
  }, [
    search_stations_text_array,
    stations,
    language,
    countries,
    languages,
    genres,
  ])

  useEffect(() => {
    actions.app.text_search_in_progress(isPending)
  }, [isPending])

  return searched_stations_with_mode
}