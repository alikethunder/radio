import { useEffect, useState } from "react"

import { actions, store, useStore } from "@/store"
import { get_api_origin } from "@/functions"

type ObjectFromList<T extends string> = {
  [K in T[][number]]: string;
}

export const useTranslations = <T extends string>(fields: T[], capitalize?: boolean): [translations: ObjectFromList<T>, loading: boolean] => {

  const [loading, set_loading] = useState(true)

  const language = useStore().translations.language()

  const translations = useStore().translations.get_translations(fields) as unknown as ObjectFromList<T>

  useEffect(() => {
    if (language) {
      const checked_fields: T[] = []
      const unchecked_fields: T[] = []

      //if the field translation was loaded in other request
      for (const field of fields) {
        (
          store.session.translation_checked(language, field)
            ? checked_fields : unchecked_fields
        ).push(field)

        actions.session.translation_checked(language, field)
      }

      if (unchecked_fields.length) {
        //console.log('[useTranslations] request : ', unchecked_fields)

        fetch(`${get_api_origin()}/api/v1/translation/${language}/?fields=${unchecked_fields.join(',')}`).then(r => r.json()).then(json => {

          //console.log('[useTranslations] response : ', json)

          Object.entries(json).map(([field, text]) => {
            actions.translations.add_translation(field, capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text)

          })

        }).finally(() => {
          set_loading(false)
        })

      } else {
        set_loading(false)
      }
    }
  }, [
    language,
  ])

  return [translations, loading]

}