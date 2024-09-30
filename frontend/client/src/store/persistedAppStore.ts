import { createStore } from 'zustand-x'

import { Panel } from 'primereact/panel'

type PersistedApp = {
  rememberme: boolean;
  search_panel: Panel | null;
  search_station_tags: string[];
  search_panel_collapsed: boolean;
  search_stations_text: string;
}

const initial_state = {
  rememberme: false,
  search_panel: null,
  search_station_tags: [],
  search_panel_collapsed: true,
  search_stations_text: '',
} as PersistedApp

export const persistedAppStore = createStore('app')(initial_state,
  {
    persist: {
      enabled: true,
      name: 'persistedApp'
    }
  })
  .extendActions((set, get, api) => ({
    add_tag_to_search: (tag: string) => {
      const cur_tags = get.search_station_tags()
      
      if (!cur_tags.includes(tag)) {
        set.search_station_tags([...cur_tags, tag])
      }
    },
  }))