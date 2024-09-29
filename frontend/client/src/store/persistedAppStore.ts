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