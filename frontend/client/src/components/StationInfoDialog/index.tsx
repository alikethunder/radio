import { FC, memo, useMemo, useState, } from "react"

import {
  actions,
  useStore,
} from "@/store"

import { Dialog } from "primereact/dialog"
import { StationAvatar } from "../StationAvatar"
import { StationTag } from "../StationTag"
import { useTranslations } from "@/hooks"
import { StationGenreTag } from "../StationGenreTag"
import { StationLanguageTag } from "../StationLanguageTag"
import { StationCountryTag } from "../StationCountryTag"
import { useAsyncMemo } from "use-async-memo"
import { Skeleton } from "primereact/skeleton"

import { tag_text_class } from '@/constants/classes'

export const StationInfoDialog: FC = memo(() => {

  const station = useStore().app.station_info_dialog()

  const language = useStore().translations.language()

  const [desc_loading, set_desc_loading] = useState(false)

  const description = useAsyncMemo(async () => {
    if (station?.id && language) {
      set_desc_loading(true)
      const res = await fetch(`/api/v1/radio/description/${station.id}/${language}`)
      const text = await res.text()
      set_desc_loading(false)
      return text
    }
  }, [station?.id, language])

  const [translations] = useTranslations([
    'tags',
    'genre',
    "language",
  ], true)

  const headerElement = useMemo(() =>
    station ?
      <div className="flex flex-row gap-3">

        <StationAvatar
          id={station?.id}
          className="w-6rem h-6rem shadow-2 flex-shrink-0 border-round-xl"
        />

        <div className="flex flex-column gap-2">

          <span className="font-bold text-base sm:text-xl">
            {
              station?.name
            }
          </span>

          <StationCountryTag en={station?.country} />

        </div>
      </div>
      : <></>
    , [station])

  return (
    <Dialog
      visible={Boolean(station)}
      modal
      header={headerElement}
      style={{
        width: '50rem',
        maxWidth: '90vw',
      }}
      onHide={() => actions.app.station_info_dialog(null)}
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

      <div className="flex flex-row gap-2">
        <span className={`font-semibold ${tag_text_class}`}>
          {translations.language}:
        </span>
        <div className="flex flex-row flex-wrap gap-1">
          {
            station?.languages?.map((language, i, arr) =>
              <>
                <StationLanguageTag language_en={language} />
                {
                  i < arr.length - 1 &&
                  <span className="text-base">
                    ,
                  </span>
                }
              </>
            )
          }
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <span className={`font-semibold ${tag_text_class}`}>
          {translations.genre}:
        </span>
        <div className="flex flex-row flex-wrap gap-1">
          {
            station?.genres?.map(genre => <StationGenreTag genre_en={genre} />)
          }
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <span className={`font-semibold ${tag_text_class}`}>
          {translations.tags}:
        </span>
        <div className="flex flex-row flex-wrap gap-1">
          {
            station?.tags?.map(tag => <StationTag tag={tag} />)
          }
        </div>
      </div>

      <p className={`m-0 ${tag_text_class}`}>
        {
          desc_loading ?
            <>
              <Skeleton className="w-full mb-2" />
              <Skeleton className="w-full mb-2" />
              <Skeleton className="w-full mb-2" />
            </>
            :
            description
        }
      </p>
    </Dialog>
  )
})