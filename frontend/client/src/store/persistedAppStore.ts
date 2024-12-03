import { createStore } from 'zustand-x'

import { Panel } from 'primereact/panel'
import { v7 } from 'uuid'

type PersistedApp = {
  rememberme: boolean;
  search_station_tags: string[];
  search_panel_closed: boolean;
  search_stations_text: string;
  favorite_stations: string[],
  user_uuid: string,
}

const initial_state = {
  rememberme: false,
  search_station_tags: [],
  search_panel_closed: true,
  search_stations_text: '',
  favorite_stations: [],
  user_uuid: v7(),
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
      const cur_tags = get.search_station_tags()

      if (!cur_tags.includes(tag)) {
        set.search_station_tags([...cur_tags, tag])
      }
    },
    toggle_favorite_station: (id: string) => {
      const cur_stations = get.favorite_stations()

      set.favorite_stations(cur_stations.includes(id) ? cur_stations.filter(cur_id => cur_id != id) : [...cur_stations, id])
    },
  }))