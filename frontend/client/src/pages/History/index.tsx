import { memo, useCallback, useEffect, useMemo, useState, useTransition } from "react"

import {
  useStore,
} from "@/store"

import { HistoryRecord, Station } from "@/types"
import { Timeline } from "primereact/timeline"
import { StationAvatar, StationCard } from "@/components"
import languages_tags from '&/settings/languages_tags.json'

import './index.sass'

export const History = memo(() => {

  const history = useStore().player.history()

  const language = useStore().translations.language()

  const home_stations = useStore().app.stations_home()

  const home_stations_loading = !useStore().app.stations_home_loaded()

  const locale = useMemo(() => languages_tags[language ?? 'en'], [language])

  const customizedMarker = useCallback((record: HistoryRecord) => {
    return (
      <>
        <div className="top_separator" />

        <div className="shadow-2 p-2 border-round flex flex-column flex-shrink-0">
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
        </div>
      </>
    )
  }, [
    locale,
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
    <div className="flex flex-column flex-grow-1 p-2 gap-2">
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