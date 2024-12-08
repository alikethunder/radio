import { forwardRef, LegacyRef, memo, useEffect, useMemo, useRef, useState } from "react"
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer"

import {
  generatePath,
} from "react-router-dom"

import { QueryLink, StationCard, StationsLoadSpinner, StationTag } from "@/components"

import {
  app_routes,
} from '@/constants/router'

import {
  store,
  useStore,
} from "@/store"

import {
  useFormState,
  useStationsSearch,
  useTranslations,
} from '@/hooks'

import {
  useLog,
} from '@/hooks'

import { Station } from "@/types"

import { Helmet } from "react-helmet"
import { list } from "@/API/station/list"
import { useDebounceCallback, useMediaQuery, useResizeObserver } from "usehooks-ts"

type Size = {
  width?: number
  height?: number
}

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

  if (rowIndex == 0 && columnIndex == 1) {
    console.log('GridCell data : ', style, data)
  }

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
    && o.data.stations.length === n.data.stations.length
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
        height: `${parseFloat(style.height) + 2 * (children[0].props.data.py ?? 32) - gap}`
      }}
      children={children}
      {...rest}
    />
  )
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
  card_size: {
    height: number,
    width: number,
  },
}) => {
  console.log('Stations_grid : ', gapx)
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
          columnWidth={card_size.width + gapx}
          rowHeight={card_size.height + gap}
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
})

export const Home = () => {

  const [stations, set_stations] = useState<Station[]>([])
  const [loading, set_loading] = useState(true)

  //useLog(true, '[Home] stations : ', stations)

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const card_size = useMemo(() => ({
    width: 144,
    height: edit_mode ? 272 : 208,
  }), [edit_mode])

  const signedin = useStore().auth.signedin()

  const root_admin = useStore().user.admin()

  const current_user_id = useStore().user.id()

  const language = useStore().translations.language()

  const languages = useStore().translations.languages()

  const some_station_admin = useMemo(() => signedin
    && current_user_id
    && stations.some(station => station.admins?.includes(current_user_id)), [
    signedin,
    root_admin,
    stations,
    current_user_id
  ])

  const [formState, set_formState] = useState({
    isValid: true,
    isSubmitting: false,
  })

  useEffect(() => {
    (async () => {
      const limit = 200
      let from
      while (true) {

        const res = await list({ limit, admin: store.user.admin(), ...from ? { from } : {} })

        //console.log(`[stations] list result : `, res)

        set_stations(s => s.concat(res))

        if (!res.length || res.length < limit) {
          //set_loading(false)
          break
        }

        from = res[res.length - 1].id
      }
    })()
  }, [])

  useFormState({
    submit() {
      //submit reorder of stations
      set_formState(fs => {
        fs.isSubmitting = true
        return fs
      })

      set_formState(fs => {
        fs.isSubmitting = false
        return fs
      })
    },
    reset() {
      //reset order of stations

    },
  }, formState, root_admin || some_station_admin)

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const searched_stations = useStationsSearch(stations)

  //useLog(true, 'searched_stations : ', searched_stations)

  const [translations] = useTranslations([
    "tags",
    'sitename',
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
      console.log('gapx : ', width, columns, r)
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
    <>
      <Helmet>
        <title>{translations.sitename}</title>

        <meta name="twitter:card" content="summary" />

        {
          language ? <meta property="og:locale" content={language} /> : <></>
        }

        <meta property="og:locale:alternate" content={languages.join(',').replaceAll(`${language},`, '').replaceAll(language ?? '', '')} />

        <meta property="og:site_name" content={translations.sitename} />

        <meta property="og:title" content={translations.sitename} />
        <meta name="twitter:title" content={translations.sitename} />

        <link rel="canonical" href={`${window.location.origin}?language=${language}`} />

        <meta property="og:url" content={`${window.location.origin}?language=${language}`} />

        <meta property="twitter:url"
          content={`${window.location.origin}?language=${language}`} />

        {/* <meta property="og:image" content={`/api/v1/files/stations/${station.id}/avatar`} /> */}
        <meta property="og:image:width" content="128" />
        <meta property="og:image:height" content="128" />
        {/* <meta property="twitter:image" content={`/api/v1/files/stations/${station.id}/avatar`} /> */}

        <meta property="twitter:domain" content={window.location.origin} />

      </Helmet>

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
    </>
  )
}