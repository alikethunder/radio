import { useMemo, useState } from "react"

import {
  useLoaderData,
  generatePath,
} from "react-router-dom"

import { QueryLink, StationCard, StationTag } from "@/components"

import {
  app_routes,
} from '@/constants/router'

import {
  useStore,
} from "@/store"

import {
  useFormState,
  useTranslations,
  useTranslationsSkeleton,
} from '@/hooks'

import {
  useLog,
} from '@/hooks'

import { Station } from "@/types"

import { Helmet } from "react-helmet"

export const Home = () => {

  const stations = useLoaderData() as Station[]

  //useLog(true, '[Home] stations : ', stations)

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const signedin = useStore().auth.signedin()

  const root_admin = useStore().user.admin()

  const current_user_id = useStore().user.id()

  const language = useStore().translations.language()

  const languages = useStore().translations.languages()

  const station_tags = useStore().app.station_tags().map(t => t.name)

  const some_station_admin = useMemo(() => signedin
    && current_user_id
    && stations.some(station => station.admins?.includes(current_user_id)), [
    signedin,
    root_admin,
    stations,
    current_user_id
  ])

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const [formState, set_formState] = useState({
    isValid: true,
    isSubmitting: false,
  })

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

  const search_stations_text_array = useMemo(() => search_stations_text.replaceAll(',', '').replaceAll('-', '').replaceAll('_', '').toLowerCase().split(' ').filter(w => !!w), [search_stations_text])

  const tags_searched_stations = useMemo(() => search_station_tags.length ? stations?.filter(station => search_station_tags.every(tag => station.tags.includes(tag))) : stations, [search_station_tags, stations])

  //useLog(true, 'tags_searched_stations : ', tags_searched_stations)

  const text_searched_stations = useMemo(() => search_stations_text_array.length ? tags_searched_stations?.filter(station => search_stations_text_array.every(w => (station[`description_${language}`] ?? '').toLowerCase().includes(w)) || search_stations_text_array.some(w => (station.name ?? '').toLowerCase().includes(w))) : tags_searched_stations, [
    search_stations_text_array,
    tags_searched_stations,
    language,
  ])

  //useLog(true, 'text_searched_stations : ', text_searched_stations)

  const searched_stations_with_mode = useMemo(() => edit_mode ?
    (
      root_admin ?
        text_searched_stations
        :
        text_searched_stations.filter(station => current_user_id && station.admins?.includes(current_user_id))
    )
    :
    text_searched_stations?.filter(station => station.broadcasting),
    [
      text_searched_stations,
      edit_mode,
      root_admin,
    ])

  //useLog(true, 'searched_stations_with_mode : ', searched_stations_with_mode)

  const [translations] = useTranslations([
    "tags",
    'sitename',
    'no_stations_with_parameters',
  ], true)

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

      <div className="sm:py-5 py-3 sm:px-6 px-2 w-full h-full overflow-y-auto page home_page flex-grow-1 flex flex-column">

        {
          searched_stations_with_mode?.length ?
            <div className={`stations_list row-gap-3 column-gap-3 mb-7`}>

              {
                edit_mode && root_admin ?
                  <QueryLink to={generatePath(`${app_routes["station$id"]}/${'?edit'/* app_routes.edit */}`, { id: "new" })} className="flex flex-column gap-2 text-primary">
                    <div className="flex flex-row overflow-hidden flex-shrink-0 shadow-2 border-round align-self-center shadow_on_hover w-9rem h-10rem">

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

              {searched_stations_with_mode?.map(station =>
                <StationCard station={station} />
              )}

            </div>
            :
            <div className="font-semibold text-2xl text-center">
              {translations.no_stations_with_parameters}
            </div>
        }
      </div >
    </>
  )
}