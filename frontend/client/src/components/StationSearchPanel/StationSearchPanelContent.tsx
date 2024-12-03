import { FC, useCallback, useMemo, useRef, useState } from "react"

import { InputText } from "primereact/inputtext"

import { OverlayPanel } from 'primereact/overlaypanel'

import { IconField } from "primereact/iconfield"

import { InputIcon } from "primereact/inputicon"

import { classNames } from 'primereact/utils'

import { StationTagRemoveTokenIcon } from "@/layout parts"

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  useTranslations,
  useTranslationsSkeleton,
} from '@/hooks'

import {
  StationTag,
} from '@/components'

import { useDebounceCallback } from "usehooks-ts"

export const StationSearchPanelContent: FC = () => {

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const [translations] = useTranslations([
    'search_radiostations',
  ], true)

  return (
    <>
      <div className="max-w-full w-20rem flex flex-column justify-content-center gap-1 align-self-stretch">

        {/* text search */}
        <IconField className="w-full align-self-start">

          {
            search_stations_text ?
              <InputIcon className="pi pi-times cursor-pointer" onClick={() => actions.persistedApp.search_stations_text('')} />
              : <></>
          }

          <InputText
            placeholder={translations.search_radiostations}
            className="w-full"
            value={search_stations_text}

            onChange={(e) => actions.persistedApp.search_stations_text(e.target.value.toLowerCase())}
          />

        </IconField>

      </div>

    </>
  )
}