import { FC, forwardRef, LegacyRef, memo, useMemo, useRef, useState, } from "react"

import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer"

import {
  StationCard,
} from '@/components'

import {
  useStore,
} from "@/store"

type Size = {
  width?: number
  height?: number
}

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

  //useLog(true, 'searched_stations : ', searched_stations)

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
      return Math.ceil(searched_stations.length / columns)
    }
  }, [
    searched_stations,
    columns,
  ])

  return (
    <div className="w-full h-full overflow-y-auto page home_page flex-grow-1 flex flex-column" ref={ref}>

      {
        searched_stations?.length || loading ?
          <>
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
            />

            {/* {
                loading ?
                  <StationsLoadSpinner />
                  : <></>
              } */}
          </>
          :
          <div className="font-semibold text-2xl text-center">
            {translations.no_stations_with_parameters}
          </div>
      }
    </div >
  )
}, (o, n) => {
  return o.stations.length === n.stations.length
    && o.loading === n.loading
})

const Stations_grid = memo(({
  stations,
  py,
  px,
  gapx,
  mobile,
  columns,
  rows,
  search_stations_text,
  card_size,
}: {
  stations: Station[],
  py: number,
  px: number,
  gapx?: number,
  mobile: boolean,
  columns?: number,
  rows?: number,
  search_stations_text: string,
  card_size: Size,
}) => {
  //console.log('Stations_grid : ', gapx)
  return (
    columns && rows && gapx ? <AutoSizer>
      {({ height, width }) =>
        <Grid
          itemData={{
            stations,
            py,
            px,
            gapx,
            mobile,
            columns,
            search_stations_text,
          }}
          innerElementType={innerElementType}
          height={height}
          width={width}
          columnWidth={(card_size.width ?? 0) + gapx}
          rowHeight={(card_size.height ?? 0) + gap}
          columnCount={columns}
          rowCount={rows}
        >
          {GridCell}
        </Grid>
      }
    </AutoSizer>
      : <></>
  )
}, (o, n) => {
  return o.columns === n.columns
    && o.rows === n.rows
    && o.card_size.height === n.card_size.height
    && o.gapx === n.gapx
    && o.stations.length === n.stations.length
  //&& o.search_stations_text === n.search_stations_text
})

const gap = 16

const GridCell = memo(({ columnIndex, rowIndex, style, data }: {
  columnIndex: number, rowIndex: number, style: {
    [x: string]: any
  }, data: {
    py: number,
    px: number,
    gapx: number,
    mobile: boolean,
    stations: Station[],
    columns: number,
    search_stations_text: string,
  }
}) => {

 /*  if (rowIndex == 0 && columnIndex == 1) {
    console.log('GridCell data : ', style, data)
  } */

  return <StationCard station={data.stations[rowIndex * data.columns + columnIndex]} style={{
    ...style,
    top: `${parseFloat(style.top) + data.py}px`,
    left: `${parseFloat(style.left) + data.px + (data.mobile ? data.gapx : 0)}px`,
    width: style.width - data.gapx,
    height: style.height - gap,
  }} />
}, (o, n) => {
  return o.data.py === n.data.py
    && o.data.px === n.data.px
    && o.data.gapx === n.data.gapx
    && o.data.mobile === n.data.mobile
    && o.style.left.toFixed(2) === n.style.left.toFixed(2)
    && o.style.top.toFixed(2) === n.style.top.toFixed(2)
    && o.columnIndex === n.columnIndex
    && o.rowIndex === n.rowIndex
    && o.data.search_stations_text === n.data.search_stations_text
})

const innerElementType = forwardRef(({ style, children, ...rest }: {
  style: {
    [x: string]: any
  },
  children: any
}, ref: LegacyRef<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        height: `${parseFloat(style.height) + 2 * (children[0]?.props?.data?.py ?? 32) - gap}`
      }}
      children={children}
      {...rest}
    />
  )
})