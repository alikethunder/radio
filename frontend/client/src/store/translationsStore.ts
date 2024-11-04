import { createStore } from 'zustand-x'

const initialState = {
  en: {},
  ru: {},
}

type Translations = {
  en: {
    [x:string]: string;
  },
  ru: {
    [x:string]: string;
  },
}

export const translationsStore = createStore('app')(initialState as Translations,
  {
    persist: {
      enabled: true,
      name: 'translationsStore'
    }
  })
  .extendSelectors((state, get, api) => ({
    get_translation(language: string | null, field: string) {
      //@ts-ignore
      return get[language ?? 'en']()[field]
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
    add_translation(language: string, field: string, translation: string) {
      //@ts-ignore
      const lang_dict = structuredClone(get[language]())
      lang_dict[field] = translation
      //@ts-ignore
      set[language](lang_dict)
    },
  }))