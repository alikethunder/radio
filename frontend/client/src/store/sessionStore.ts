import { createStore } from 'zustand-x'

import {
  app_routes,
} from '@/constants/router'

import { createJSONStorage } from 'zustand/middleware'

import {
  StationTag,
  StationLanguage,
  StationCountry,
  StationGenre
} from '@/types'

type SessionStore = {
  rightSidebarOpened: boolean;
  leftSidebarOpened: boolean;
  prev_pathname: string;
  redirect_from_google: boolean;
  pwa_event: any;
  station_tags: StationTag[]; //all possible station tags
  station_languages: StationLanguage[]; //all possible station languages
  station_countries: StationCountry[]; //all possible station countries
  station_genres: StationGenre[]; //all possible station genres
}

const initial_state = {
  rightSidebarOpened: false,
  leftSidebarOpened: false,
  prev_pathname: app_routes.root,
  redirect_from_google: false,
  pwa_event: null,
  station_tags: [],
  station_languages: [],
  station_countries: [],
  station_genres: [],
} as SessionStore

export const sessionStore = createStore('sessionStore')(initial_state, {
  persist: {
    enabled: true,
    name: 'sessionStore',
    storage: createJSONStorage(() => sessionStorage),
  }
})
  .extendSelectors((state, get, api) => ({
    get_station_tag(name: string) {
      return get.station_tags()?.find(t => t.name == name)
    },
    get_genre(en: string) {
      return get.station_genres()?.find(t => t.en == en)
    },
    get_country(en?: string) {
      return en ? get.station_countries()?.find(t => t.en.toLowerCase() == en.toLowerCase()) : null
    },
    get_language(en: string) {
      return get.station_languages()?.find(t => t.en == en)
    },
  }))
  .extendActions((set, get, api) => ({
    update_tags: (tags: StationTag[]) => {
      set.station_tags([...get.station_tags(), ...tags].filter((t, i, a) => i === a.indexOf(t)))
    },
  }))
