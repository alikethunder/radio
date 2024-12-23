import { createStore } from 'zustand-x'

import {
  app_routes,
} from '@/constants/router'

import { createJSONStorage } from 'zustand/middleware'
import { Station } from '@/types';

type SessionStore = {
  rightSidebarOpened: boolean;
  leftSidebarOpened: boolean;
  prev_pathname: string;
  redirect_from_google: boolean;
  checked_translation: {
    en: {
      [x: string]: boolean;
    };
    ru: {
      [x: string]: boolean;
    };
    sp: {
      [x: string]: boolean;
    };
    de: {
      [x: string]: boolean;
    };
    fr: {
      [x: string]: boolean;
    };
    pt: {
      [x: string]: boolean;
    };
  };
  pwa_event: any;
  stations_home: Station[];
  stations_favorite: Station[];
  stations_home_loaded: boolean;
  stations_favorite_loaded: boolean;
  stations_home_last_id: string | null;
  stations_favorite_last_id: string | null;
}

const initial_state = {
  rightSidebarOpened: false,
  leftSidebarOpened: false,
  prev_pathname: app_routes.root,
  redirect_from_google: false,
  checked_translation: {
    en: {},
    ru: {},
    sp: {},
    de: {},
    fr: {},
    pt: {},
  },
  pwa_event: null,
  stations_home: [],
  stations_home_loaded: false,
  stations_home_last_id: null,
  stations_favorite: [],
  stations_favorite_loaded: false,
  stations_favorite_last_id: null,
} as SessionStore

export const sessionStore = createStore('sessionStore')(initial_state, {
  persist: {
    enabled: true,
    name: 'sessionStore',
    storage: createJSONStorage(() => sessionStorage),
  }
})
  .extendSelectors((state, get, api) => ({
    translation_checked(language: string | null, field: string) {
      //returns if translation was checked
      //@ts-ignore
      return get.checked_translation()[language ?? 'en']?.[field]
    },
  }))
  .extendActions((set, get, api) => ({
    translation_checked(language: string, field: string) {
      //stores that translation was checked
      //@ts-ignore
      const checked_translation = structuredClone(get.checked_translation())
      //@ts-ignore
      checked_translation[language] = checked_translation[language] ?? {}
      //@ts-ignore
      checked_translation[language][field] = true
      //@ts-ignore
      set.checked_translation(checked_translation)
    },
    add_stations_home(stations: Station[]) {
      const stations_home = get.stations_home()
      set.stations_home(stations_home.concat(stations))
    },
    add_stations_favorite(stations: Station[]) {
      const stations_favorite = get.stations_favorite()
      set.stations_favorite(stations_favorite.concat(stations))
    },
  }))
