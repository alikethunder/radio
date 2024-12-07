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

const card_size = {
  width: 144,
  height: 208,
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
  }
}) => {

  if (!rowIndex && !columnIndex) {
    console.log('GridCell data : ', style, data)
  }

  return <StationCard station={data.stations[rowIndex * data.columns + columnIndex]} style={{
    ...style,
    top: `${parseFloat(style.top) + data.py + gap}px`,
    left: `${parseFloat(style.left) + data.px + (data.mobile ? data.gapx : 0)}px`,
    width: style.width - data.gapx,
    height: style.height - gap,
  }} />
}, (o, n) => {
  //console.log('GridCell o,n : ', o, n)
  return o.data.py === n.data.py
    && o.data.px === n.data.px
    && o.data.gapx === n.data.gapx
    && o.data.mobile === n.data.mobile
    && o.style.left.toFixed(2) === n.style.left.toFixed(2)
    && o.style.top.toFixed(2) === n.style.top.toFixed(2)
    && o.columnIndex === n.columnIndex
    && o.rowIndex === n.rowIndex
})

const innerElementType = memo(forwardRef(({ style, children, ...rest }: {
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
        height: `${parseFloat(style.height) + 2 * (children[0].props.data.py ?? 32)}`
      }}
      children={children}
      {...rest}
    />
  )
}), (o, n) => {
  //console.log('innerElementType o,n : ', o, n)
  return o.children.length === n.children.length
    && o.style.height.toFixed(2) === n.style.height.toFixed(2)
    && o.style.width.toFixed(2) === n.style.width.toFixed(2)
    && o.style.pointerEvents === n.style.pointerEvents
  //&& o.children[0].props.data.gapx === n.children[0].props.data.gapx
  //&& o.children[0].props.data.mobile === n.children[0].props.data.mobile
})

export const Home = () => {

  const [stations, set_stations] = useState<Station[]>([])
  const [loading, set_loading] = useState(true)

  //useLog(true, '[Home] stations : ', stations)

  const edit_mode = useStore().app.FormActionsState_edit_mode()

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
      const limit = 50
      let from
      while (true) {

        const res = await list({ limit, admin: store.user.admin(), ...from ? { from } : {} })

        //console.log(`[stations] list result : `, res)

        set_stations(s => s.concat(res))

        if (!res.length || res.length < limit) {
          set_loading(false)
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
          columns && rows && gapx ?
            <AutoSizer>
              {({ height, width }) =>
                <Grid
                  itemData={{
                    stations: searched_stations,
                    py,
                    px,
                    gapx,
                    mobile,
                    columns,
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
        }

        {/* {
          searched_stations?.length || loading ?
            <>
              <div className={`stations_list row-gap-3 column-gap-3 mb-7`}>

                {
                  edit_mode && root_admin ?
                    <QueryLink to={generatePath(`${app_routes["station$id"]}/${'?edit'}`, { id: "new" })} className="flex flex-column gap-2 text-primary">
                      <div className="flex flex-row overflow-hidden flex-shrink-0 shadow-2 border-round align-self-center shadow_on_hover w-9rem h-13rem">

                        <div className="station_card_icon align-self-center flex align-items-center justify-content-center">
                          <i className="pi pi-plus-circle" style={{ fontSize: '2rem' }}></i>
                        </div>

                        <div className="station_card_header align-self-center font-semibold flex-grow-1 text-center action_text_font">
                          Create new radio
                        </div>
                      </div>

                      <div className="flex flex-row flex-wrap align-items-start gap-1">

                        <StationTag tag="A" color="" />

                        <StationTag tag="A" color="" />
                      </div>
                    </QueryLink>
                    : <></>
                }
                {searched_stations?.map(station =>
                  <StationCard station={station} />
                )}
                {
                  loading ?
                    <StationsLoadSpinner />
                    : <></>
                }
              </div>
            </>
            :
            <div className="font-semibold text-2xl text-center">
              {translations.no_stations_with_parameters}
            </div>
        } */}
      </div >
    </>
  )
}