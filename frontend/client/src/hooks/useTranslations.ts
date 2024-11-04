import { useEffect, useState } from "react"

import { actions, store, useStore } from "@/store"

type ObjectFromList<T extends string> = {
  [K in T[][number]]: string;
}

export const useTranslations = <T extends string>(fields: T[], capitalize?: boolean): [translations: ObjectFromList<T>, loading: boolean] => {

  const [loading, set_loading] = useState(true)

  const language = useStore().translations.language()

  const checked_request = useStore().session.translation_checked(language, fields.join('+'))

  const translations = useStore().translations.get_translations(fields)

  useEffect(() => {
    if (language && !checked_request) {
      actions.session.translation_checked(language, fields.join('+'))
      const checked_fields = []
      const unchecked_fields = []

      //if the field translation was loaded in other request
      for (const field of fields) {
        if (store.session.translation_checked(language, field)) {
          checked_fields.push(field)
        } else {
          unchecked_fields.push(field)
        }
      }

      if (unchecked_fields.length) {

        fetch(`/api/v1/translation/${language}/?fields=${unchecked_fields.join(',')}`).then(r => r.json()).then(json => {

          Object.entries(json).map(([field, text]) => {
            actions.translations.add_translation(field, capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text)

            actions.session.translation_checked(language, field)
          })

          set_loading(false)
        })

      } else {
        set_loading(false)
      }

    }
  }, [language, fields, checked_request])

  return [translations as unknown as ObjectFromList<T>, checked_request ? false : loading]

}