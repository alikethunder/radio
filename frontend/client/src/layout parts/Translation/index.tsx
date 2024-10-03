import React, { FC, useEffect, useState } from "react"

import { Skeleton } from 'primereact/skeleton'

import { useStore } from "@/store"

interface Props {
  field: string;
  [x: string]: string;
}

export const Translation: FC<Props> = ({ field, className, }) => {

  const [translation, set_translation] = useState('')
  const [loading, set_loading] = useState(true)

  const language = useStore().persistedApp.language()

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/v1/translation/${language}/${field}`)
      const text = await resp.text()

      set_translation(text)
      set_loading(false)

    })()

  }, [language, field])

  return loading ? <Skeleton className={`inline-block ${className ?? ''}`} /> : translation ?? ''
}
