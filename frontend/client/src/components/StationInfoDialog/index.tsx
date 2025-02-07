import { FC, memo, useMemo, } from "react"

import {
  actions,
  useStore,
} from "@/store"

import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { StationAvatar } from "../StationAvatar"
import { StationTag } from "../StationTag"
import { useTranslations } from "@/hooks"
import { StationGenreTag } from "../StationGenreTag"
import { StationLanguageTag } from "../StationLanguageTag"

export const StationInfoDialog: FC = memo(() => {

  const station = useStore().app.station_info_dialog()

  const country = useStore().session.get_country(station?.country)

  const language = useStore().translations.language()

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

          <span className="font-bold">
            {
              station?.name
            }
          </span>

          <span className="inline text-base font-semibold">
            <span className="text-xl line-height-1 mr-1">
              {country?.flag}
            </span>

            {country?.[language ?? 'en']}
          </span>


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
          className: 'p-3 sm:p-4',
        },
        content: {
          className: 'flex flex-column gap-3',
        }
      }}
    >

      <div className="flex flex-row gap-2">
        <span className="text-base font-semibold area_name">
          {translations.language}:
        </span>
        <div className="flex flex-row flex-wrap gap-1">
          {
            station?.languages?.map(language => <StationLanguageTag language_en={language} />)
          }
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <span className="text-base font-semibold area_name">
          {translations.genre}:
        </span>
        <div className="flex flex-row flex-wrap gap-1">
          {
            station?.genres?.map(genre => <StationGenreTag genre_en={genre} />)
          }
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <span className="text-base font-semibold area_name">
          {translations.tags}:
        </span>
        <div className="flex flex-row flex-wrap gap-1">
          {
            station?.tags?.map(tag => <StationTag tag={tag} />)
          }
        </div>
      </div>

      <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Dialog>
  )
})