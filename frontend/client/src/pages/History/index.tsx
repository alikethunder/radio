import { memo, useCallback, useEffect, useMemo, useState, useTransition } from "react"

import {
  actions,
  store,
  useStore,
} from "@/store"

import { HistoryRecord, Station } from "@/types"
import { Timeline } from "primereact/timeline"
import { StationAvatar, StationCard } from "@/components"
import languages_tags from '&/settings/languages_tags.json'

import './index.sass'
import { Button } from "primereact/button"
import { useTooltip, useTranslations } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"

export const History = memo(() => {

  const history = useStore().player.history()

  const language = useStore().translations.language()

  const home_stations = useStore().app.stations_home()

  const signedin = useStore().auth.signedin()

  const home_stations_loading = !useStore().app.stations_home_loaded()

  const locale = useMemo(() => languages_tags[language ?? 'en'], [language])

  const [translations] = useTranslations([
    'remove',
    'something_went_wrong_try_again',
  ], true)

  const remove_tooltip = useTooltip(translations.remove)

  const delete_history_record = useCallback(
    useDebounceCallback(
      async (record_id: string) => {
        if (signedin) {
          const resp = await fetch(`${window.location.origin}/api/v1/history/record/${record_id}`, {
            method: 'DELETE',
          })
          if (resp.status === 200) {
            actions.player.delete_history_record(record_id)
          } else {
            store.toast['center']().show({
              severity: 'error',
              summary: 'Error',
              detail: translations.something_went_wrong_try_again,
              closable: true,
              life: 1500
            })
          }
        } else {
          actions.player.delete_history_record(record_id)
        }
      }, 50)
    , [
      translations.something_went_wrong_try_again,
      signedin,
    ])

  const customizedMarker = useCallback((record: HistoryRecord) => {
    return (
      <>
        <div className="top_separator" />

        <div className="shadow-2 p-2 border-round flex flex-column flex-shrink-0 relative">
          <span>
            {
              Intl.DateTimeFormat(locale, {
                weekday: 'long'
              }).format(new Date(record.date))
            }
          </span>
          <span>
            {
              Intl.DateTimeFormat(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(record.date))
            }
          </span>
          <span>
            {
              Intl.DateTimeFormat(locale, {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }).format(new Date(record.date))
            }
          </span>
          <span>
            {
              Intl.DateTimeFormat(locale, {
                timeZoneName: "short",
              }).format(new Date(record.date)).split(' ')[1]
            }
          </span>

          <Button
            icon={`pi pi-trash`}
            rounded
            outlined
            raised
            className={`p-0 w-2rem h-2rem shadow_on_hover flex flex-shrink-0 justify-content-center align-items-center absolute top-100 left-0 mt-2`}
            severity="danger"

            onClick={e => delete_history_record(record?.id)}

            {...remove_tooltip}
          />
        </div>
      </>
    )
  }, [
    locale,
    delete_history_record,
    remove_tooltip,
  ])

  const customizedContent = useCallback((record: HistoryRecord) => {
    const station = home_stations.find(s => s.id === record.station_id)
    return (
      station ?
        <StationCard station={station} />
        : <></>
    )
  }, [
    home_stations,
  ])

  return (
    <div className="flex flex-column flex-grow-1 p-2 gap-2 overflow-y-auto">
      History

      <Timeline
        layout="vertical"
        value={history}
        marker={customizedMarker}
        content={customizedContent}
        dataKey="id"
        pt={{
          root: {
            className: 'align-items-center history_timeline',
          },
          content: {
            className: 'mb-3 p-0 pl-3'
          },
          separator: {
            className: 'text-center flex-shrink-0 flex-grow-1',
          },
          opposite: {
            className: 'hidden',
          },
        }}
      />
    </div>
  )
})