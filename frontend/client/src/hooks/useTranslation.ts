import { useEffect, useState } from "react"

import { actions, useStore } from "@/store"

export const useTranslation = (field: string, capitalize?: boolean,): [string, boolean] => {

  const [loading, set_loading] = useState(true)

  const language = useStore().translations.language()

  const translation = useStore().translations.get_translation(field)

  const translation_checked = useStore().session.translation_checked(language, field)

  useEffect(() => {
    if (language && !translation_checked) {
      (async () => {
        const resp = await fetch(`/api/v1/translation/${language}/${field}`)
        const text = await resp.text()

        actions.translations.add_translation(field, capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text)

        actions.session.translation_checked(language, field)

        set_loading(false)

      })()
    }
  }, [language, translation_checked])

  return [translation, translation_checked ? false : loading]
}