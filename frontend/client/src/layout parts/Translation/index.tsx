import React, { FC, useEffect, useState } from "react"

import { Skeleton } from 'primereact/skeleton'

import { useStore } from "@/store"

import { useTranslation } from "@/hooks"

type Props = {
  capitalize?: boolean;
  field: string;
  className?: string;
} & {
  [x: string]: any;
}

export const Translation: FC<Props> = ({ field, className, capitalize, }) => {

  const [translation, loading] = useTranslation(field, capitalize)

  return loading ? <Skeleton className={`inline-block ${className ?? ''}`} /> : translation ?? ''
} 
