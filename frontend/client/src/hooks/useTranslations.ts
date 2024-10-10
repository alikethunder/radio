import { useEffect, useState } from "react"

import { useStore } from "@/store"

type ObjectFromList<T extends readonly string[]> = {
  [K in T[number]]: string;
}

export const useTranslations = <T extends readonly string[]>(fields: T, capitalize?: boolean): [ObjectFromList<T>, boolean] => {

  const [translations, set_translations] = useState<{ [x: string]: string }>({})

  const [loading, set_loading] = useState(true)

  const language = useStore().persistedApp.language()

  useEffect(() => {

    fetch(`/api/v1/translation/${language}/?fields=${fields.join(',')}`).then(r => r.json()).then(json => {
      set_translations(capitalize ? Object.fromEntries(Object.entries(json).map(([field, text]) => [field, text.charAt(0).toUpperCase() + text.slice(1)])) : json)

      set_loading(false)
    })

  }, [language])

  return [translations as unknown as ObjectFromList<T>, loading]

}