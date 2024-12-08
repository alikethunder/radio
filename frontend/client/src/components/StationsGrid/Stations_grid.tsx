import { Station } from "@/types"
import { memo } from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeGrid as Grid } from 'react-window'

import { GridCell } from './GridCell'
import { innerElementType } from "./innerElementType"

import { gap } from './constants'

import { Size } from '@/types/size'

export const Stations_grid = memo(({
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
  loading: boolean,
}) => {
  console.log('[Stations_grid] : ', loading, stations)
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
            loading,
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
    && o.loading === n.loading
})