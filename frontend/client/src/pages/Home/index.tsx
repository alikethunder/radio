import { FC, useEffect, useMemo, useState } from "react"

import {
  useLoaderData,
  generatePath,
} from "react-router-dom"

import { SmallCardContainer } from "@/layout parts"

import { Ripple } from "primereact/ripple"

import { classNames } from 'primereact/utils'

import { QueryLink, StationTag } from "@/components"

import './index.sass'

import {
  app_routes,
} from '@/constants/router'

import {
  actions,
  store,
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
import { useDebounceCallback } from "usehooks-ts"

import { Helmet } from "react-helmet"

export const Home = () => {

  const stations = useLoaderData() as Station[]

  useLog(true, '[Home] stations : ', stations)

  const windowSize = useStore().app.windowSize()
  const isDesktop = useStore().app.isDesktop()

  const width = useMemo(() =>
    isDesktop ? windowSize.width * .21 : Math.min(windowSize.width, windowSize.height) * .8
    , [isDesktop, windowSize])

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

  const playing = useStore().player.playing()

  const current_station = useStore().player.current_station()

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

  const search_stations_text_array = useMemo(() => search_stations_text.replaceAll(',', '').replaceAll('-', '').replaceAll('_', '').split(' ').filter(w => !!w), [search_stations_text])

  const tags_searched_stations = useMemo(() => search_station_tags.length ? stations?.filter(station => search_station_tags.every(tag => station.tags.includes(tag))) : stations, [search_station_tags, stations])

  //useLog(true, 'tags_searched_stations : ', tags_searched_stations)

  const text_searched_stations = useMemo(() => search_stations_text_array.length ? tags_searched_stations?.filter(station => search_stations_text_array.every(w => station[`description_${language}`].toLowerCase().includes(w)) || search_stations_text_array.some(w => station.name.toLowerCase().includes(w))) : tags_searched_stations, [
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

  const play_click = useDebounceCallback((station) => {
    if (store.player.playing() && store.player.current_station()?.id == station.id) {
      actions.player.playing(false)
    } else {
      actions.player.playing(true)
      actions.player.current_station(station)
    }
  }, 50)

  const [translations] = useTranslations([
    "home_page_description",
    "tags",
    'sitename',
  ], true)


  const translations_skl = useTranslationsSkeleton({
    "home_page_description": ["w-12"],
    "tags": ['w-4rem'],
  }, true)

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

        <meta name="description" content={`${translations.home_page_description} ${translations.tags}: ${station_tags.join(',')}`} />
        <meta property="og:description" content={`${translations.home_page_description} ${translations.tags}: ${station_tags.join(',')}`} />
        <meta property="twitter:description" content={`${translations.home_page_description} ${translations.tags}: ${station_tags.join(',')}`} />

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

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Radiostations",
          "name": translations.sitename,
          "description": translations.home_page_description,
          "availableLanguage": [
            {
              "@type": "Language",
              "name": "English"
            },
            {
              "@type": "Language",
              "name": "Russian",
            }
          ],
          "keywords": station_tags.join(","),
          //logo: `/api/v1/files/stations/${station.id}/avatar`,
          "url": `${window.location.origin}?language=${language}`
        })}
      </script>


      <div className="sm:py-5 py-3 sm:px-6 px-2 w-full h-full overflow-y-auto page home_page flex-grow-1 flex flex-column">

        <div className={`stations_list row-gap-2 column-gap-3 mb-4 ${edit_mode ? 'row-gap-7' : ''}`}>

          {
            edit_mode && root_admin ?
              <QueryLink to={generatePath(`${app_routes["station$id"]}/${'?edit'/* app_routes.edit */}`, { id: "new" })} className="flex flex-column gap-2 text-primary">
                <div className="flex flex-row overflow-hidden flex-shrink-0 shadow-2 border-round align-self-center shadow_on_hover w-9rem h-10rem">

                  <div className="station_card_icon align-self-center flex align-items-center justify-content-center">
                    <i className="pi pi-plus-circle" style={{ fontSize: '2rem' }}></i>
                  </div>

                  <div className="station_card_header align-self-center font-semibold flex-grow-1 text-center lobster_font">
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

          {
            searched_stations_with_mode?.map(station =>
              <div className="flex flex-column gap-2 w-9rem">

                <div className={classNames({
                  'current_station active_element': current_station?.id == station.id,
                },
                  'flex',
                  'flex-column',
                  'gap-1',
                  'overflow-hidden',
                  'text-primary',
                  'shadow_on_hover',
                  'element_with_overlay',
                  'w-9rem',
                  'h-13rem',
                  'flex-shrink-0 shadow-2 border-round',
                )}>

                  <div className="flex flex-row gap-1">
                    <div
                      className="w-full h-5rem flex align-items-center justify-content-center p-ripple relative surface-100"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        play_click(station)
                      }} >

                      <i className="pi pi-wave-pulse " style={{ fontSize: '2rem' }}></i>

                      <div className="absolute w-full h-full top-0 left-0 bg-no-repeat bg-contain bg-center surface-100 station_image"
                        style={{
                          backgroundImage: `url(/api/v1/files/stations/${station.id}/avatar)`,
                        }} >

                        <img
                          style={{ display: 'none' }}
                          src={`/api/v1/files/stations/${station.id}/avatar`}

                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null

                            const p = currentTarget.closest('.station_image') as HTMLElement

                            if (p) p.style.display = 'none'
                          }}
                        />
                      </div>

                      <div
                        className="overlay absolute top-0 bottom-0 right-0 left-0 flex align-items-center justify-content-center text-center cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          play_click(station)
                        }}>

                        <div className="overlay_background surface-900 absolute top-0 bottom-0 right-0 left-0"></div>

                        <div className="overlay_text text-white font-semibold z-1">
                          <i className={`pi ${current_station?.id == station.id && playing ? 'pi-pause' : 'pi-play'}`} style={{ fontSize: '2rem' }}></i>
                        </div>

                      </div>

                      <Ripple />

                    </div>

                    {/* likes listeners */}
                  </div>

                  <div className="flex flex-column justify-content-between flex-grow-1 px-1 pb-1">

                    <div className="flex flex-column justify-content-center flex-grow-1">

                      <QueryLink to={generatePath(app_routes["station$id"], { id: station.id })} className="font-semibold text-primary text-center station_name mb-1  text_hidden_overflow line-clamp-3">
                        {station.name}
                      </QueryLink>
                    </div>

                    <div className="station_tags_container text-center text_hidden_overflow line-clamp-2">
                      {
                        station.tags.map(tag => <StationTag tag={tag} />)
                      }
                    </div>
                  </div>

                </div>

                {
                  edit_mode ?
                    <div className="flex flex-row flex-wrap flex-shrink-0 align-items-start gap-1 overflow-hidden h-3rem">

                      <StationTag tag="Broadcasting" color={station.broadcasting ? 'green-400' : 'surface-300'} disable_link />

                      <StationTag tag="External" color={station.external && station.external_enable ? 'green-400' : 'surface-300'} disable_link />
                    </div>
                    : <></>
                }
              </div>
            )}

        </div>

        <div className="shadow-2 p-3 w-12 mt-auto border-round flex flex-column ">
          <div className="inline-block text-center">
            {translations_skl.home_page_description}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {translations_skl.tags}: {station_tags.map(t => <StationTag tag={t} />)}
          </div>
        </div>
      </div >
    </>
  )
}