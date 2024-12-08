import { FC, memo, useMemo, useRef, useState, } from "react"

import { Stations_grid } from './Stations_grid'

import { gap } from './constants'

import {
  useStore,
} from "@/store"

import { Size } from '@/types/size'

import { useDebounceCallback, useMediaQuery, useResizeObserver } from "usehooks-ts"
import { Station } from "@/types"
import { useLog, useStationsSearch, useTranslations } from "@/hooks"

type Props = {
  stations: Station[];
  loading: boolean;
}

export const StationsGrid: FC<Props> = memo(({ stations, loading }) => {

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const card_size = useMemo(() => ({
    width: 144,
    height: edit_mode ? 272 : 208,
  }), [edit_mode])

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const searched_stations = useStationsSearch(stations)

  useLog(true, '[StationsGrid] searched_stations : ', searched_stations, loading)

  const [translations] = useTranslations([
    'no_stations_with_parameters',
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

  const mobile = useMediaQuery('(max-width: 768px)')

  const py = useMemo(() => mobile ? 16 : 32, [mobile])

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
    <div className="w-full h-full overflow-y-auto page home_page flex-grow-1 flex flex-column" ref={ref}>

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
          />
          :
          <div className="font-semibold text-2xl text-center">
            {translations.no_stations_with_parameters}
          </div>
      }
    </div >
  )
}, (o, n) => {
  return o.stations.length === n.stations.length
})
