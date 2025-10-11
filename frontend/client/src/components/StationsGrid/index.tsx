import { FC, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, } from "react"

import { Stations_grid } from './Stations_grid'

import { gap } from './constants'

import {
  actions,
  store,
  useStore,
} from "@/store"

import { Size } from '@/types/size'

import { useDebounceCallback, useResizeObserver } from "usehooks-ts"
import { Station } from "@/types"
import { useHideTooltip, useLog, useMobile, useStationsSearch, useTranslations } from "@/hooks"
import { YandexAd } from "@/components/YandexAd"
import { Message } from 'primereact/message'
import { Button } from "primereact/button"
import { IoDiceSharp } from "react-icons/io5"
import { ga_event, hide_multiselects, switch_to_random_station } from "@/functions"
import { ShareListIcon } from "@/components/ShareListIcon"

import { ReactComponent as Found_svg } from '@/assets/svg/found.svg'

type Props = {
  stations: Station[];
  loading: boolean;
  place: 'home' | 'my_stations';
}

export const StationsGrid: FC<Props> = memo(({ stations, loading, place }) => {

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const tooltipOptions = useHideTooltip()

  const card_size = useMemo(() => ({
    width: 144,
    height: edit_mode ? 272 : 208,
  }), [edit_mode])

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const searched_stations = useStationsSearch(stations)

  const searched_stations_length = useMemo(() => searched_stations.length, [searched_stations.length])

  const show_share_list_button = useMemo(() => searched_stations_length && searched_stations_length < 205, [searched_stations_length])

  const share_list_popup_opened = useStore().app.share_list_popup_opened()

  useEffect(() => {
    if (show_share_list_button && share_list_popup_opened) {
      setTimeout(() => {
        actions.app.share_stations_list(searched_stations)
      }, 100)
    }
  }, [searched_stations, show_share_list_button, share_list_popup_opened])

  const [translations] = useTranslations([
    'no_stations_with_parameters',
    'number_of_stations_found',
    'random_station_from_found',
    'share_stations_list',
  ], true)

  const ref = useRef<HTMLDivElement>(null)

  const [message_ref, set_message_ref] = useState<HTMLDivElement | null>(null)

  const set_m_ref = useCallback((e: HTMLDivElement | null) => {
    set_message_ref(e)
  }, [])

  const [{ width, height }, setSize] = useState<Size>({
    width: undefined,
    height: undefined,
  })

  const onResize = useDebounceCallback(setSize, 200)

  useResizeObserver({
    ref,
    onResize,
  })

  const mobile = useMobile()

  //padding y
  const py = useMemo(() => 16, [])

  //padding x
  const px = useMemo(() => mobile ? 0 : 48, [mobile])

  const columns = useMemo(() => {
    if (width) {
      return Math.floor(
        mobile ?
          (width - gap * .5) / (card_size.width + gap * .5)
          :
          (width + gap - 2 * px) / (card_size.width + gap))
    }
  }, [
    width,
    px,
    mobile,
  ])

  const gapx = useMemo(() => {
    if (columns && width) {
      const r = Number((
        (width - 2 * px - columns * card_size.width) / (columns + (mobile ? 1 : -1))
      ).toFixed(2))
      return r
    }
  }, [
    width,
    px,
    columns,
    mobile,
  ])

  const rows = useMemo(() => {
    if (columns && searched_stations_length) {
      return Math.ceil((searched_stations_length + Number(loading)) / columns)
    }
  }, [
    columns,
    loading,
    searched_stations_length,
  ])

  const play_random_station = useCallback(useDebounceCallback(() => {

    ga_event({
      event: 'random_station',
      place: 'home_page',
    })

    switch_to_random_station(searched_stations)
  }, 50), [searched_stations])

  const share_list = useCallback(useDebounceCallback(() => {
    actions.app.share_list_popup_opened(true)
  }, 50), [])

  const random_station_button = useMemo(() =>
    searched_stations_length ?
      <Button
        rounded
        outlined
        raised
        className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center inline-flex`}
        severity={`secondary`}

        onClick={play_random_station}

        tooltip={translations.random_station_from_found}
        {...{ tooltipOptions: { ...tooltipOptions, position: 'bottom' } }}
      >
        <IoDiceSharp style={{
          width: '1.5rem',
          height: '1.5rem',
        }} />
      </Button>
      : <></>
    , [
      play_random_station,
      translations.random_station_from_found,
      searched_stations_length,
      tooltipOptions,
    ])

  const share_list_button = useMemo(() =>
    show_share_list_button ?
      <Button
        rounded
        outlined
        raised
        className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center inline-flex`}
        style={{
          color: '#5486f3'
        }}

        onClick={share_list}

        tooltip={translations.share_stations_list}
        {...{ tooltipOptions: { ...tooltipOptions, position: 'bottom' } }}
        disabled={share_list_popup_opened}
      >
        {
          share_list_popup_opened ?
            <i className="pi pi-spin pi-spinner" />
            :
            <ShareListIcon background='#e9e9ff' />
        }
      </Button>
      : <></>
    , [
      translations.share_stations_list,
      show_share_list_button,
      share_list,
      share_list_popup_opened,
      tooltipOptions,
    ])

  const count_message = useMemo(() =>
    <>
      {/* Found svg */}
      <svg
        className="flex-shrink-0"
        style={{
          width: '1.8rem',
          height: '1.8rem',
          fill: '#696cff',
        }}
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256">
        <g><g><g><path fill="#000000" d="M92.6,139.6c0-9.6,3.5-17.9,10.5-24.9s15.3-10.5,24.9-10.5s17.9,3.5,24.9,10.5s10.5,15.3,10.5,24.9s-3.5,17.9-10.5,24.9c-7,7-15.3,10.5-24.9,10.5s-17.9-3.5-24.9-10.5C96,157.5,92.6,149.2,92.6,139.6z M222.7,217.8l-45.4-45.4c6.6-10.3,10-21.2,10-32.7c0-16.3-5.8-30.1-17.5-41.5c-11.6-11.4-25.6-17.2-41.8-17.2s-30.2,5.7-41.8,17.2c-11.6,11.4-17.5,25.3-17.5,41.5c0,16.3,5.8,30.2,17.5,41.8c11.6,11.6,25.6,17.5,41.8,17.5c11.4,0,22.3-3.3,32.7-10l52.1,52.6c-4.1,3-8.7,4.4-13.8,4.4H57.1c-6.3,0-11.8-2.3-16.6-6.9c-4.8-4.6-7.2-10.1-7.2-16.4l0.6-189.5c0-6.3,2.3-11.7,6.9-16.4c4.6-4.6,10.1-6.9,16.3-6.9h94.7l70.9,70.9V217.8z" /></g></g></g>
      </svg>

      <span className="md:text-base text-sm">
        {translations.number_of_stations_found}: {searched_stations_length} {loading ? <span className="pi pi-spinner pi-spin"></span> : <span className="w-1rem inline-block"></span>}
      </span>

      <div className="flex flex-row gap-2 ml-2">

        {random_station_button}

        {share_list_button}

      </div>
    </>
    , [
      translations.number_of_stations_found,
      searched_stations_length,
      loading,
      random_station_button,
      share_list_button,
    ])

  useEffect(() => {
    // hide/show search panel when touch moved on message of found stations
    if (message_ref) {
      let touch_start: number | null

      const touch_start_f = (e: TouchEvent) => {
        touch_start = e.changedTouches[0].clientY
      }

      const touch_move_f = (e: TouchEvent) => {
        e.preventDefault()
        if (touch_start) {
          hide_multiselects()
          actions.persistedApp.search_panel_closed(e.changedTouches[0].clientY < touch_start)
        }
      }

      message_ref.addEventListener('touchstart', touch_start_f)

      message_ref.addEventListener('touchmove', touch_move_f, { passive: false })

      return () => {
        message_ref.removeEventListener('touchstart', touch_start_f)
        message_ref.removeEventListener('touchmove', touch_move_f)
      }
    }
  }, [message_ref])

  useLayoutEffect(() => {
    // hide search panel when touch moved on stations grid
    const c_ref = ref.current
    if (c_ref) {
      let touch_start: number | null

      const touch_start_f = (e: TouchEvent) => {
        touch_start = e.changedTouches[0].clientY
      }

      const touch_move_f = (e: TouchEvent) => {
        if (touch_start && e.changedTouches[0].clientY < touch_start) {
          hide_multiselects()
          actions.persistedApp.search_panel_closed(true)
        }
      }

      c_ref.addEventListener('touchstart', touch_start_f)

      c_ref.addEventListener('touchmove', touch_move_f)

      return () => {
        c_ref.removeEventListener('touchstart', touch_start_f)
        c_ref.removeEventListener('touchmove', touch_move_f)
      }
    }
  }, [ref])

  return (
    <>
      {
        searched_stations_length ?
          <div ref={set_m_ref}>
            <Message
              severity="info"
              className="font-medium select-none align-self-start py-1 px-2 border-none md:ml-6 my-2 inline-flex align-items-center"

              style={{
                ...mobile ? {
                  marginLeft: `${gapx}px`,
                  marginRight: `${gapx}px`,
                } : {}
              }}

              content={count_message}
            />
          </div>
          : <></>
      }

      <div className="w-full h-full overflow-y-auto page flex-grow-1 flex flex-column" ref={ref}>

        {
          searched_stations_length || loading ?
            <Stations_grid
              stations={searched_stations}
              columns={columns}
              rows={rows}
              py={py}
              px={px}
              gapx={gapx}
              mobile={mobile}
              search_stations_text={search_stations_text}
              card_size={card_size}
              loading={loading}
              place={place}
            />
            :
            <div className="font-semibold text-2xl text-center mt-2">
              {translations.no_stations_with_parameters}
            </div>
        }
      </div >
    </>
  )
}, (o, n) => {
  return o.stations.length === n.stations.length
    && o.place === n.place
    && o.loading === n.loading
})
