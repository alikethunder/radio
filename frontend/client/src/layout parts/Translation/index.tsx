import React, { FC, useEffect, useState } from "react"

import { Skeleton } from 'primereact/skeleton'

interface Props {
  field: string;
  [x: string]: string;
}

export const Translation: FC<Props> = ({ field, className, }) => {

  const [translation, set_translation] = useState('')
  const [loading, set_loading] = useState(true)

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/v1/translation/${field}`)
      const text = await resp.text()

      set_translation(text)
      set_loading(false)

    })()

  }, [])

  return loading ? <Skeleton className={`inline-block ${className ?? ''}`} /> : translation ?? ''
}
