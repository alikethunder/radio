import { createStore } from 'zustand-x'

import { Panel } from 'primereact/panel'
import { v7 } from 'uuid'

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
  indexed_stations: string[];
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
  indexed_stations: [],
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
  }))