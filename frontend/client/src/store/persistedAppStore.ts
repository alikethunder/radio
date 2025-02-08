import { createStore } from 'zustand-x'

import { v7 } from 'uuid'
import { StationCountry, StationGenre, StationLanguage } from '@/types';

type PersistedApp = {
  rememberme: boolean;
  search_stations_text: string;
  search_stations_text_array: string[];
  search_panel_closed: boolean;
  favorite_stations: string[],
  user_uuid: string,
  home_scroll: number;
  my_stations_scroll: number;
  theme: 'light' | 'dark';
  search_selected_countries: StationCountry[];
  search_selected_languages: StationLanguage[];
  search_selected_genres: StationGenre[];
}

const initial_state = {
  rememberme: false,
  search_stations_text: '',
  search_stations_text_array: [],
  search_panel_closed: true,
  favorite_stations: [],
  user_uuid: v7(),
  home_scroll: 0,
  my_stations_scroll: 0,
  theme: window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light',
  search_selected_countries: [],
  search_selected_languages: [],
  search_selected_genres: [],
} as PersistedApp

export const persistedAppStore = createStore('app')(initial_state,
  {
    persist: {
      enabled: true,
      name: 'persistedApp'
    }
  })
  .extendSelectors((state, get, api) => ({
    favorite_station: (id?: string) => id && get.favorite_stations().includes(id),
  }))
  .extendActions((set, get, api) => ({
    add_tag_to_search: (tag: string) => {
      const cur_text = get.search_stations_text()

      if (!cur_text.includes(tag)) {
        set.search_stations_text(cur_text + " " + tag)
      }
    },
    toggle_favorite_station: (id: string) => {
      const cur_stations = get.favorite_stations()

      set.favorite_stations(cur_stations.includes(id) ? cur_stations.filter(cur_id => cur_id != id) : [...cur_stations, id])
    },
    toggle_genre_search(genre: StationGenre) {
      const cur_genres = get.search_selected_genres()
      if (cur_genres.find(g => g.en === genre.en)) {
        set.search_selected_genres(cur_genres.filter(g => g.en !== genre.en))
      } else {
        set.search_selected_genres([...cur_genres, genre])
      }
    },
    toggle_language_search(language: StationLanguage) {
      const cur_languages = get.search_selected_languages()
      if (cur_languages.find(g => g.en === language.en)) {
        set.search_selected_languages(cur_languages.filter(g => g.en !== language.en))
      } else {
        set.search_selected_languages([...cur_languages, language])
      }
    },
    toggle_country_search(country: StationCountry) {
      const cur_countries = get.search_selected_countries()
      if (cur_countries.find(g => g.en === country.en)) {
        set.search_selected_countries(cur_countries.filter(g => g.en !== country.en))
      } else {
        set.search_selected_countries([...cur_countries, country])
      }
    },
  }))