import React, { FC, useEffect, useState } from "react"

import { Skeleton } from 'primereact/skeleton'

import { useStore } from "@/store"

type Props = {
  capitalize?: boolean;
  field: string;
  className?: string;
} & {
  [x: string]: any;
}

export const Translation: FC<Props> = ({ field, className, capitalize, }) => {

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

  return loading ? <Skeleton className={`inline-block ${className ?? ''}`} /> : translation ?? ''
}
