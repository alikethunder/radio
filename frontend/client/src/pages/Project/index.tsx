import { FC, useCallback, useEffect, useMemo } from "react"

import {
  useLoaderData,
  useNavigate, 
  useParams,
} from "react-router-dom"

import { Button } from 'primereact/button'

import { CreateNewCard } from '@/components'

import { SmallCardContainer } from "@/layout parts"

import { QueryLink } from "@/components"

import './index.sass'

import {
  store,
  useTrackedStore,
} from "@/store"

import {
  useImmutableFetcher,
  sortByPriority,
  useImmutableFetcherAndStore,
} from "@/functions"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Tooltip } from "primereact/tooltip"

export const Project = () => {

  const navigate = useNavigate()

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const project = useLoaderData()

  return (
    <div
      className="sm:py-5 py-4 sm:px-6 px-4 w-full overflow-y-auto page project_page flex-grow-1 flex flex-column"
    >
      


    </div>
  )
}