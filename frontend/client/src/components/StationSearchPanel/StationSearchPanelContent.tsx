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

  const station_tags = useStore().app.station_tags().map(t => t.name)

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const [tags_input_value, set_tags_input_value] = useState('')

  const tag_ref = useRef<HTMLInputElement | null>(null)

  const overlay_panel = useRef<OverlayPanel | null>(null)

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const filtered_tags = useMemo(() => station_tags.filter(tag => tag.includes(tags_input_value) && !search_station_tags.includes(tag)), [tags_input_value, station_tags, search_station_tags])

  const [translations] = useTranslations([
    'search_station_name_and_description',
    'search_stations_by_tags',
    'no_such_tags',
  ], true)

  const translations_skl = useTranslationsSkeleton({
    "search_radiostations": ["w-7rem"],
    "radiostation": ['w-8rem'],
  }, true)

  const click_search_tag = useCallback(useDebounceCallback(tag => {
    actions.persistedApp.add_tag_to_search(tag)
    set_tags_input_value('')

    overlay_panel.current?.hide()

    if (filtered_tags.length > 1) {
      //hide if it's the last tag and panel will be empty
      setTimeout(() => {
        (tag_ref.current?.querySelector('[data-id="tag_input"]') as HTMLInputElement)?.focus()
      }, 50);
    }
  }, 50), [filtered_tags])

  const click_tag_remove = useCallback(useDebounceCallback(tag => {
    actions.persistedApp.search_station_tags(store.persistedApp.search_station_tags().filter(t => t != tag))
  }, 50), [])

  return (
    <>
      <div className="max-w-full w-20rem flex flex-column justify-content-center gap-1 align-self-stretch">
        <div className="font-semibold flex-shrink-0 text-xl sm:text-2xl mb-auto">
          {translations_skl.search_radiostations}
        </div>

        {/* text search */}
        <IconField className="w-full align-self-start">

          {
            search_stations_text ?
              <InputIcon className="pi pi-times cursor-pointer" onClick={() => actions.persistedApp.search_stations_text('')} />
              : <></>
          }

          <InputText
            placeholder={translations.search_station_name_and_description}
            className="w-full"
            value={search_stations_text}

            onChange={(e) => actions.persistedApp.search_stations_text(e.target.value)}
          />

        </IconField>

      </div>

      {/* tags search */}
      <div className="flex flex-column gap-2 max-w-full w-20rem" ref={tag_ref}>

        <div className="flex flex-row flex-wrap gap-2 align-items-start">
          {/* searched tags */}

          {
            search_station_tags?.map(tag =>
              <div className="flex bg-red-600 border-round align-items-center hover:overflow-hidden">
                <StationTag tag={tag} disable_link />

                <StationTagRemoveTokenIcon
                  onClick={() => click_tag_remove(tag)} />
              </div>
            )
          }
        </div>

        <IconField>

          {
            tags_input_value ?
              <InputIcon className="pi pi-times cursor-pointer" onClick={() => set_tags_input_value('')} />
              : <></>
          }

          <InputText
            data-id="tag_input"
            placeholder={translations.search_stations_by_tags}
            className="w-full"
            value={tags_input_value}
            disabled={tags_input_value ? false : !filtered_tags.length}

            onChange={(e) => set_tags_input_value(e.target.value)}

            onFocus={(e) => {
              overlay_panel.current?.show(e, e.target)
            }}

            onKeyUp={(e) => {
              const exact = filtered_tags.find(t => t === (e.target as HTMLInputElement).value)

              if (
                e.code == 'Enter'
                || e.key == 'Enter'
              ) {
                if (filtered_tags.length == 1) {

                  actions.persistedApp.add_tag_to_search(filtered_tags[0])
                  set_tags_input_value('')

                } else if (exact) {

                  actions.persistedApp.add_tag_to_search(exact)
                  set_tags_input_value('')
                }
              }
            }}
          />

        </IconField>

        <OverlayPanel
          ref={overlay_panel}
          pt={{
            root: {
              className: classNames({

              },
                'max-w-25rem',
                'w-11',
                'shadow-5',
                'surface-hover',
              )
            },
            content: {
              className: classNames({},
                "flex flex-wrap gap-2 p-2 overflow-y-auto max-h-22rem",
              )
            }
          }}
        >
          {
            filtered_tags?.map(tag => <StationTag
              tag={tag}
              onClick={() => click_search_tag(tag)}
            />)
          }
          {
            filtered_tags.length ?
              <></>
              :
              tags_input_value ?
                translations.no_such_tags
                :
                ''
          }
        </OverlayPanel>

      </div>
    </>
  )
}