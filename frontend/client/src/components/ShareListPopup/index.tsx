import { FC, memo, useMemo, useState, } from "react"

import {
  actions,
  useStore,
} from "@/store"

import { Dialog } from "primereact/dialog"
import {
  StationAvatar,
  StationTag,
  StationGenreTag,
  StationLanguageTag,
  StationCountryTag,
  AddStationToFavorites,
  StationShareButton,
} from "@/components"

import { useTranslations } from "@/hooks"
import { Skeleton } from "primereact/skeleton"

import { tag_text_class } from '@/constants/classes'

export const ShareListPopup: FC = memo(() => {

  const stations = useStore().app.share_stations_list()

  const [translations] = useTranslations([
    'share_list',
  ], true)

  const headerElement = useMemo(() =>
    <div className="flex flex-row gap-3 text-center">
      {translations.share_list}

    </div>
    , [translations.share_list])

  return (
    <Dialog
      visible={Boolean(stations.length)}
      modal
      header={headerElement}
      style={{
        width: '50rem',
        maxWidth: '95vw',
      }}
      onHide={() => actions.app.share_stations_list([])}
      resizable={false}
      dismissableMask={true}
      draggable={false}

      pt={{
        header: {
          className: 'p-3 sm:p-4 pr-2 sm:pr-2 pb-0 sm:pb-0',
        },
        content: {
          className: 'flex flex-column gap-2 sm:gap-3 p-3 sm:p-4 pr-2 sm:pr-2 pt-2 sm:pt-3',
        },
        headerIcons: {
          className: '-mt-2 sm:-mt-3',
        }
      }}
    >

    </Dialog>
  )
})