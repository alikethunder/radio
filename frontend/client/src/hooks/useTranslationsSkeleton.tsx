import { FC, ReactElement, useEffect, useState } from "react"

import { useTranslations } from "@/hooks/useTranslations"

import { Skeleton } from 'primereact/skeleton'

export const useTranslationsSkeleton = (fields: [field: string, className?: string][], capitalize?: boolean): { [x: string]: string } => {

  const field_names = fields.map(([field]) => field)

  const [translations, loading] = useTranslations(field_names, capitalize)

  return Object.fromEntries(Object.entries(translations).map(([field, translation], i) => [field, <>
    {
      loading ?
        <Skeleton className={`inline-block ${fields[i][1] ?? ''}`} />
        : translation
    }
  </> as unknown as string]))

}