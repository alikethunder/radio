import { useEffect, useState } from "react"

import { useStore } from "@/store"

export const useTranslation = (field: string, capitalize?: boolean,): [string, boolean] => {

  const [translation, set_translation] = useState('')
  const [loading, set_loading] = useState(true)

  const language = useStore().persistedApp.language()

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/v1/translation/${language}/${field}`)
      const text = await resp.text()

      set_translation(capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text)

      set_loading(false)

    })()

  }, [language, field])

  return [translation, loading]
}