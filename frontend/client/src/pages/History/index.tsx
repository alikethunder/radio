import { memo, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"

import {
  actions,
  store,
  useStore,
} from "@/store"

import { HistoryRecord } from "@/types"
import { Timeline } from "primereact/timeline"
import { StationCard, YandexAd } from "@/components"
import languages_tags from '&/settings/languages_tags.json'

import './index.sass'
import { Button } from "primereact/button"
import { useHideTooltip, useMobile, useTooltip, useTranslations } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"
import { Message } from "primereact/message"
import { IoDiceSharp } from "react-icons/io5"
import { ga_event, get_api_origin, switch_to_random_station } from "@/functions"
import { useResizeObserver } from 'usehooks-ts'

export const History = memo(() => {

  const stored_history = useStore().player.history()

  const history = useMemo(() => stored_history.reverse(), [stored_history])

  const history_loaded = useStore().app.history_loaded()

  const language = useStore().translations.language()

  const tooltipOptions = useHideTooltip()

  const home_stations = useStore().app.stations_home()

  const signedin = useStore().auth.signedin()

  const home_stations_loaded = useStore().app.stations_home_loaded()

  const locale = useMemo(() => languages_tags[language ?? 'en'], [language])

  const [translations] = useTranslations([
    'remove',
    'something_went_wrong_try_again',
    'history_of_listened_stations',
    'no_listened_stations',
    'clear_history',
    'random_station_from_history',
  ], true)

  const remove_tooltip = useTooltip(translations.remove)

  const clear_history_tooltip = useTooltip(translations.clear_history)

  const delete_history_record = useCallback(
    useDebounceCallback(
      async (record_id: string) => {
        if (signedin) {
          const resp = await fetch(`${get_api_origin()}/api/v1/history/record/${record_id}`, {
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

  const clear_history = useCallback(
    useDebounceCallback(
      async () => {
        if (signedin) {
          const resp = await fetch(`${get_api_origin()}/api/v1/history/all`, {
            method: 'DELETE',
          })
          if (resp.status != 200) {
            store.toast['center']().show({
              severity: 'error',
              summary: 'Error',
              detail: translations.something_went_wrong_try_again,
              closable: true,
              life: 1500
            })
            return
          }
        }
        actions.player.delete_history()
        actions.player.current_history_station_id(null)
      }, 50)
    , [
      translations.something_went_wrong_try_again,
      signedin,
    ])

  const history_stations_ids = useMemo(() => history.map(record => record.station_id), [history])

  const history_stations = useMemo(() =>
    home_stations.filter(s => history_stations_ids.includes(s.id))
    , [
      history_stations_ids,
      home_stations,
    ])

  const play_random_station = useCallback(useDebounceCallback(() => {

    ga_event({
      event: 'random_station',
      place: 'history_page',
    })

    switch_to_random_station(history_stations, true)
  }, 50), [history_stations])

  const customizedMarker = useCallback((record: HistoryRecord) => {
    const date = new Date(
      record.date.includes('+0000 UTC') ? record.date.replace(' +0000 UTC', '') : record.date
    )
    return (
      <>
        <div className="top_separator" />

        <div className="shadow-2 p-2 border-round flex flex-column flex-shrink-0 relative">
          <span>
            {
              Intl.DateTimeFormat(locale, {
                weekday: 'long'
              }).format(date)
            }
          </span>
          <span>
            {
              Intl.DateTimeFormat(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(date)
            }
          </span>
          <span>
            {
              Intl.DateTimeFormat(locale, {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }).format(date)
            }
          </span>
          <span>
            {
              Intl.DateTimeFormat(locale, {
                timeZoneName: "short",
              }).format(date).split(' ')[1]
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
        <StationCard station={station} at_history className="relative" />
        : <></>
    )
  }, [
    home_stations,
  ])

  const loading = useMemo(() => !home_stations_loaded || !history_loaded, [
    home_stations_loaded,
    history_loaded,
  ])

  const count_message = useMemo(() =>
    <>
      <span className={`pi mr-1 ${loading ? 'pi-spinner pi-spin' : 'pi-history'}`}></span>

      <span className="md:text-base text-sm">
        {translations.history_of_listened_stations}
      </span>

      {
        loading ? <></> :
          <div className="flex flex-row gap-2 ml-3">

            <Button
              icon={`pi pi-eraser`}
              rounded
              outlined
              raised
              className={`p-0 w-2rem h-2rem shadow_on_hover flex flex-shrink-0 justify-content-center align-items-center`}
              severity="danger"

              onClick={clear_history}

              {...clear_history_tooltip}
            />

            {
              history_stations.length > 1 ?
                <Button
                  rounded
                  outlined
                  raised
                  className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center inline-flex`}
                  severity={`secondary`}

                  onClick={play_random_station}

                  tooltip={translations.random_station_from_history}
                  {...{ tooltipOptions }}
                >
                  <IoDiceSharp style={{
                    width: '1.5rem',
                    height: '1.5rem',
                  }} />
                </Button>
                : <></>
            }

          </div>
      }
    </>
    , [
      translations.history_of_listened_stations,
      translations.random_station_from_history,
      loading,
      clear_history_tooltip,
      clear_history,
      play_random_station,
      history_stations,
    ])

  const mobile = useMobile()

  const set_ad_size = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const child = node.children[0] as HTMLElement
      if (child) {
        const rect = node.getBoundingClientRect()
        child.style.width = `${rect.width}px`
        child.style.height = `${document.body.clientHeight - rect.top}px`
      }
    }
  }, [])

  const ad_container_ref = useCallback((node: HTMLDivElement | null) => {
    setTimeout(() => {
      set_ad_size(node)
    }, 500)
  }, [set_ad_size])

  const timeline_container_ref = useRef<HTMLDivElement>(null)

  const onResize = useCallback(useDebounceCallback(() => {
    if (timeline_container_ref.current) {
      timeline_container_ref.current.querySelectorAll('.side_ad_container').forEach(ad_container => {
        set_ad_size(ad_container as HTMLDivElement)
      })
    }
  }, 200)
    , [
      set_ad_size,
    ])

  const _ = useResizeObserver({
    ref: timeline_container_ref,
    onResize,
  })

  return (
    <div className="flex flex-column flex-grow-1 p-2 gap-2 overflow-y-auto" ref={timeline_container_ref}>
      <div >
        <Message
          severity="success"
          className="font-medium select-none align-self-start py-1 px-2 border-none md:ml-6 my-2 inline-flex align-items-center"

          content={count_message}
        />
      </div>

      {
        loading ? <></> :
          history.length ?
            <div className="flex flex-row justify-content-center">
              {
                mobile ? <></> :
                  <div
                    className="relative flex-grow-1 side_ad_container pointer-events-none"
                    ref={ad_container_ref}
                  >
                    <YandexAd id="R-A-14083703-10" className="fixed" />
                  </div>
              }

              <Timeline
                layout="vertical"
                value={history}
                marker={customizedMarker}
                content={customizedContent}
                dataKey="id"
                pt={{
                  root: {
                    className: 'align-items-center history_timeline flex-shrink-0 flex-grow-0 md:px-7',
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

              {
                mobile ? <></> :
                  <div
                    className="relative flex-grow-1 side_ad_container pointer-events-none"
                    ref={ad_container_ref}
                  >
                    {/* <YandexAd id="R-A-14083703-11" className="fixed" /> */}
                  </div>
              }

            </div>
            :
            <span className="md:ml-6 font-semibold text-2xl">
              {translations.no_listened_stations}
            </span>
      }
    </div>
  )
})