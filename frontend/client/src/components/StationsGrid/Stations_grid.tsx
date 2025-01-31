import { Station } from "@/types"
import { FC, memo, useMemo, } from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeGrid as Grid } from 'react-window'

import { GridCell } from './GridCell'
import { innerElementType } from "./innerElementType"

import { gap } from './constants'

import { Size } from '@/types/size'
import {
  actions,
  store,
} from "@/store"
import { useLog } from "@/hooks"

type Props = {
  stations: Station[],
  py: number,
  px: number,
  gapx?: number,
  mobile: boolean,
  columns?: number,
  rows?: number,
  search_stations_text: string,
  card_size: Size,
  loading: boolean,
  place: 'home' | 'my_stations',
}

export const Stations_grid: FC<Props> = memo(({
  stations,
  py,
  px,
  gapx,
  mobile,
  columns,
  rows,
  search_stations_text,
  card_size,
  loading,
  place,
}) => {

  //console.log('[Stations_grid] : ', loading, stations)

  const scroll_prop = useMemo(() => `${place}_scroll` as 'home_scroll' | 'my_stations_scroll', [place])

  //useLog(true, '[Stations_grid] : ', columns, gapx, rows, loading)

  return (
    columns
      && gapx
      && (
        rows
        || loading
      )
      ?
      <AutoSizer>
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
              loading,
            }}

            innerElementType={innerElementType}
            overscanRowCount={5}

            initialScrollTop={store.persistedApp[scroll_prop]()}

            onScroll={({
              scrollTop,
            }) => {
              actions.persistedApp[scroll_prop](scrollTop)
            }}

            height={height}
            width={width}

            columnWidth={(card_size.width ?? 0) + gapx}
            rowHeight={(card_size.height ?? 0) + gap}

            columnCount={columns}
            rowCount={rows ?? 1}
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
    && o.loading === n.loading
    && o.place === n.place
})