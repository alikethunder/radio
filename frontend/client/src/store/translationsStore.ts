import { createStore } from 'zustand-x'

import type {Language} from '@/types'

const initialState = {
  en: {},
  ru: {},
  sp: {},
  fr: {},
  de: {},
  pt: {},
  language: null,
  languages: [],
}

type Translations = {
  en: {
    [x: string]: string;
  },
  ru: {
    [x: string]: string;
  },
  sp: {
    [x: string]: string;
  },
  fr: {
    [x: string]: string;
  },
  de: {
    [x: string]: string;
  },
  pt: {
    [x: string]: string;
  },
  language: Language | null,
  languages: Language[],
}

export const translationsStore = createStore('app')(initialState as Translations,
  {
    persist: {
      enabled: true,
      name: 'translationsStore'
    }
  })
  .extendSelectors((state, get, api) => ({
    get_translation(field: string) {
      //@ts-ignore
      return get[get.language() ?? 'en']()[field]
    },
    get_translations(fields: string[]) {
      //@ts-ignore
      return Object.fromEntries(fields.map(field => [field, get[get.language() ?? 'en']()[field]]))
    },
  }))
  .extendActions((set, get, api) => ({
    reset: () => {
      Object.getOwnPropertyNames(set)
        .filter(n => ![
          'mergeState',
          'state'
        ].includes(n))
        //@ts-ignore
        .forEach(n => set[n](initialState[n]))
    },
    add_translation(field: string, translation: string) {
      //@ts-ignore
      const lang_dict = structuredClone(get[get.language()]())
      lang_dict[field] = translation
      //@ts-ignore
      set[get.language()](lang_dict)
    },
  }))