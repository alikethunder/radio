import { FC, memo, useCallback, useMemo, useRef, useState, } from "react"

import { Stations_grid } from './Stations_grid'

import { gap } from './constants'

import {
  actions,
  store,
  useStore,
} from "@/store"

import { Size } from '@/types/size'
import { BsFillInfoSquareFill } from "react-icons/bs"

import { useDebounceCallback, useResizeObserver } from "usehooks-ts"
import { Station } from "@/types"
import { useLog, useMobile, useStationsSearch, useTranslations } from "@/hooks"
import { YandexAd } from "@/components/YandexAd"
import { Message } from 'primereact/message'
import { Button } from "primereact/button"
import { IoDiceSharp } from "react-icons/io5"
import { switch_to_random_station } from "@/functions"
import { ShareListIcon } from "../ShareListIcon"

type Props = {
  stations: Station[];
  loading: boolean;
  place: 'home' | 'my_stations';
}

export const StationsGrid: FC<Props> = memo(({ stations, loading, place }) => {

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const card_size = useMemo(() => ({
    width: 144,
    height: edit_mode ? 272 : 208,
  }), [edit_mode])

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const searched_stations = useStationsSearch(stations)

  //useLog(true, '[StationsGrid] searched_stations : ', searched_stations, loading)

  const [translations] = useTranslations([
    'no_stations_with_parameters',
    'number_of_stations_found',
    'random_station_from_found',
    'share_list',
  ], true)

  const ref = useRef<HTMLDivElement>(null)

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
    if (columns && searched_stations.length) {
      return Math.ceil((searched_stations.length + Number(loading)) / columns)
    }
  }, [
    searched_stations,
    columns,
    loading,
  ])

  const play_random_station = useCallback(useDebounceCallback(() => {

    switch_to_random_station(searched_stations)

  }, 50), [searched_stations])

  const share_list = useCallback(useDebounceCallback(() => {

    actions.app.share_stations_list(searched_stations)

  }, 50), [searched_stations])

  const random_station_button = useMemo(() =>
    searched_stations.length ?
      <Button
        rounded
        outlined
        raised
        className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center inline-flex`}
        severity={`secondary`}

        onClick={play_random_station}

        tooltip={translations.random_station_from_found}
        tooltipOptions={{
          position: 'bottom',
        }}
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
      searched_stations.length,
    ])

  const share_list_button = useMemo(() =>
    searched_stations.length ?
      <Button
        rounded
        outlined
        raised
        className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center inline-flex`}
        severity={`info`}

        onClick={share_list}

        tooltip={translations.share_list}
        tooltipOptions={{
          position: 'bottom',
        }}
      >
        <ShareListIcon />
      </Button>
      : <></>
    , [
      translations.share_list,
      searched_stations.length,
      share_list,
    ])

  const count_message = useMemo(() =>
    <>
      <BsFillInfoSquareFill
        className="flex-shrink-0 md:align-self-center align-self-start"
        style={{
          width: '1.3rem',
          height: '1.3rem',
        }}
      />

      <span className="align-self-start md:align-self-center">
        {translations.number_of_stations_found}: {searched_stations.length} {loading ? <span className="pi pi-spinner pi-spin"></span> : <span className="w-1rem inline-block"></span>}
      </span>

      <div className="flex flex-column md:flex-row gap-2">

        {random_station_button}

        {share_list_button}

      </div>
    </>
    , [
      translations.number_of_stations_found,
      searched_stations.length,
      loading,
      random_station_button,
      share_list_button,
    ])

  return (
    <>
      {
        searched_stations.length ?
          <Message
            severity="info"
            className="font-medium select-none align-self-start py-1 px-2 border-none md:ml-6 my-2 inline-flex align-items-center gap-2"

            style={{
              ...mobile ? {
                marginLeft: `${gapx}px`,
                marginRight: `${gapx}px`,
              } : {}
            }}

            content={count_message}
          />
          : <></>
      }

      <div className="w-full h-full overflow-y-auto page flex-grow-1 flex flex-column" ref={ref}>

        {
          searched_stations?.length || loading ?
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
            <div className="font-semibold text-2xl text-center">
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
