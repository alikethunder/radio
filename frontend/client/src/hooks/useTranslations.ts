import { useEffect, useState } from "react"

import { useStore } from "@/store"

export const useTranslations = (fields: string[], capitalize?: boolean): [{ [x: string]: string }, boolean] => {

  const [translations, set_translations] = useState<{ [x: string]: string }>({})

  const [loading, set_loading] = useState(true)

  const language = useStore().persistedApp.language()

  useEffect(() => {
    //console.log('useTranslations : ', fields, language);

    fetch(`/api/v1/translation/${language}/?fields=${fields.join(',')}`).then(r => r.json()).then(json => {
      //console.log(json)
      set_translations(capitalize ? Object.fromEntries(Object.entries(json).map(([field, text]) => [field, text.charAt(0).toUpperCase() + text.slice(1)])) : json)

      set_loading(false)
    })

  }, [language])

  return [translations, loading]

}