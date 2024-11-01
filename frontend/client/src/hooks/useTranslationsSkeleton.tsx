import { FC, ReactElement, useEffect, useState } from "react"

import { useTranslations } from "@/hooks/useTranslations"

import { Skeleton } from 'primereact/skeleton'

export const useTranslationsSkeleton = <T extends Record<string, string[]>>(fields: T, capitalize?: boolean) => {

  //fields[key][0] - will be applied to Skeleton
  //fields[key][1] - will be applied to text div

  const keys = Object.keys(fields)

  const [translations, loading] = useTranslations(keys, capitalize)

  return Object.fromEntries(Object.keys(translations).map(
    key => [key, <>
      {
        /* true || */ loading ?
          <Skeleton className={`inline-block ${fields[key][0] ?? ''}`} />
          : <div className={`inline-block ${(fields[key][1] ?? '')}`} dangerouslySetInnerHTML={{__html: translations[key]}}></div>
      }
    </> as unknown as string]
  )) as { [K in keyof T]: string }

}