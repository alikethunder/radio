import { createStore } from 'zustand-x'

import type { Language } from '@/types'
import { get_api_origin } from "@/functions"

const initialState = {
  dictionary: {},
  language: null,
  languages: [],
  loading: false,
}

type Translations = {
  dictionary: {
    [x: string]: {
      [y: string]: string;
    }
  },
  language: Language | null,
  languages: Language[],
  loading: boolean,
}

export const translationsStore = createStore('app')(initialState as Translations,
  {
    persist: {
      enabled: true,
      name: 'translationsStore'
    }
  })
  .extendSelectors((state, get, api) => ({
    get_translation(field: string, capitalize?: boolean) {
      //@ts-ignore
      const tr = get.dictionary()[get.language() ?? 'en'][field]
      return tr ? capitalize ? tr.charAt(0) + tr.slice(1) : tr : ''
    },
  }))
  .extendSelectors((state, get, api) => ({
    get_translations(fields: string[], capitalize?: boolean) {
      //@ts-ignore
      return Object.fromEntries(fields.map(field => {
        return [field, get.get_translation(field, capitalize)]
      }))
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
    set_language(language: Language) {
      set.language(language)
      //get dictionary for this language
      set.loading(true)
      fetch(`${get_api_origin()}/dictionary/${language}.json`).then(r => r.json()).then(json => { get.dictionary()[language] = json }).finally(() => {
        set.loading(false)
      })
    },
    set_languages(languages: Language[]) {
      set.languages(languages)

      set.dictionary(Object.fromEntries(languages.map(l => [l, {}])))
    }
  }))