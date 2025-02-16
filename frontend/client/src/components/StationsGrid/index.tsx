import { FC, memo, useMemo, useRef, useState, } from "react"

import { Stations_grid } from './Stations_grid'

import { gap } from './constants'

import {
  useStore,
} from "@/store"

import { Size } from '@/types/size'

import { useDebounceCallback, useResizeObserver } from "usehooks-ts"
import { Station } from "@/types"
import { useLog, useMobile, useStationsSearch, useTranslations } from "@/hooks"
import { YandexAd } from "@/components/YandexAd"
import { Message } from 'primereact/message'

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
      //console.log('gapx : ', width, columns, r)
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

  return (
    <>
      <YandexAd id="R-A-14083703-2" className="h-5rem flex-shrink-0" />

      {
        searched_stations.length ?
          <Message severity="info" className="mt-3 font-medium md:ml-6 select-none align-self-start py-1 px-2 border-none"
            style={{
              ...mobile ? {
                marginLeft: `${gapx}px`,
                marginRight: `${gapx}px`,
              } : {}
            }}

            text={`${translations.number_of_stations_found} : ${searched_stations.length}`}
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
