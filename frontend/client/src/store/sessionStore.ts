import { createStore } from 'zustand-x'

import {
  app_routes,
} from '@/constants/router'

import { createJSONStorage } from 'zustand/middleware'
import { Station } from '@/types';

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
  checked_translation: {
    en: {},
    ru: {},
    sp: {},
    de: {},
    fr: {},
    pt: {},
  },
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
    translation_checked(language: string | null, field: string) {
      //returns if translation was checked
      //@ts-ignore
      return get.checked_translation()[language ?? 'en']?.[field]
    },
    get_station_tag(name: string) {
      return get.station_tags()?.find(t => t.name == name)
    },
    get_genre(en: string) {
      return get.station_genres()?.find(t => t.en == en)
    }
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
    update_tags: (tags: StationTag[]) => {
      set.station_tags([...get.station_tags(), ...tags].filter((t, i, a) => i === a.indexOf(t)))
    },
  }))
