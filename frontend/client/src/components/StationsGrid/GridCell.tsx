import { Station } from "@/types"
import { memo } from "react"

import {
  StationCard,
  StationsLoadSpinner,
} from '@/components'

import { gap } from './constants'

export const GridCell = memo(({ columnIndex, rowIndex, style, data }: {
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
    loading: boolean,
  }
}) => {
  const index = rowIndex * data.columns + columnIndex

  /* if (data.loading){
    console.log('[GridCell] ', index, data.stations.length)
  } */

  return data.loading && index == data.stations.length ?
    <StationsLoadSpinner style={{
      ...style,
      top: `${parseFloat(style.top) + data.py}px`,
      left: `${parseFloat(style.left) + data.px + (data.mobile ? data.gapx : 0)}px`,
      width: style.width - data.gapx,
      height: style.height - gap,
    }} />
    :
    data.stations[index] ?
      <StationCard station={data.stations[index]} style={{
        ...style,
        top: `${parseFloat(style.top) + data.py}px`,
        left: `${parseFloat(style.left) + data.px + (data.mobile ? data.gapx : 0)}px`,
        width: style.width - data.gapx,
        height: style.height - gap,
      }} /> : <></ >
}, (o, n) => {
  const n_i = n.rowIndex * n.data.columns + n.columnIndex

  return o.data.py === n.data.py
    && o.data.px === n.data.px
    && o.data.gapx === n.data.gapx
    && o.data.mobile === n.data.mobile
    && o.style.left.toFixed(2) === n.style.left.toFixed(2)
    && o.style.top.toFixed(2) === n.style.top.toFixed(2)
    && o.columnIndex === n.columnIndex
    && o.rowIndex === n.rowIndex
    && o.data.search_stations_text === n.data.search_stations_text
    && o.data.stations.length === n.data.stations.length
    && o.data.loading === n.data.loading
})