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
} from '@/hooks'

import {
  useLog,
} from '@/hooks'

import { Station } from "@/types"

export const Home = () => {

  const stations = useLoaderData() as Station[]

  useLog('[Home] stations : ', stations)

  const windowSize = useStore().app.windowSize()
  const isDesktop = useStore().app.isDesktop()

  const width = useMemo(() =>
    isDesktop ? windowSize.width * .21 : Math.min(windowSize.width, windowSize.height) * .8
    , [isDesktop, windowSize])

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const signedin = useStore().auth.signedin()

  const root_admin = useStore().user.admin()

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
  }, formState, root_admin)

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const search_stations_text_array = useMemo(() => search_stations_text.replaceAll(',', '').replaceAll('-', '').replaceAll('_', '').split(' ').filter(w => !!w), [search_stations_text])

  const searched_stations = useMemo(() => {
    let result = stations

    if (search_station_tags.length) {
      result = result.filter(station => search_station_tags.every(tag => station.tags.includes(tag)))
    }

    if (search_stations_text_array.length) {
      result = result.filter(station => search_stations_text_array.every(w => station.description.toLowerCase().includes(w)) || search_stations_text_array.some(w => station.name.toLowerCase().includes(w)))
    }

    return result
  }, [stations, search_station_tags, search_stations_text_array])

  return (
    <div className="sm:py-5 py-3 sm:px-6 px-2 w-full h-full overflow-y-auto page home_page flex-grow-1 flex flex-column">

      <div className={`stations_list gap-2 column-gap-3 ${edit_mode ? 'row-gap-8' : ''}`}>

        {
          edit_mode ?
            <QueryLink to={generatePath(`${app_routes["station$id"]}/${'?edit'/* app_routes.edit */}`, { id: "new" })} className="flex flex-column gap-2">
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
          searched_stations?.map(station =>
            <div className="flex flex-column gap-2 w-9rem">

              <div className={classNames({
                'current_station active_element': current_station?.id == station.id,
              },
                'flex',
                'flex-column',
                'gap-1',
                'overflow-hidden',
                'text-secondary',
                'shadow_on_hover',
                'element_with_overlay',
                'w-9rem',
                'h-13rem',
                'flex-shrink-0 shadow-2 border-round',
              )}>

                <div className="flex flex-row gap-1">
                  <div
                    style={{
                      ...station.avatar ? { backgroundImage: `url(/api/v1/files/stations/${station.id}/avatar)` } : {},
                    }}
                    className="w-full h-5rem flex align-items-center justify-content-center p-ripple  bg-no-repeat bg-contain bg-center surface-100" >

                    {
                      station.avatar ?
                        <></>
                        :
                        <i className="pi pi-wave-pulse " style={{ fontSize: '2rem' }}></i>
                    }

                    <div
                      className="overlay absolute top-0 bottom-0 right-0 left-0 flex align-items-center justify-content-center text-center cursor-pointer"
                      onClick={() => {
                        if (store.player.playing() && store.player.current_station()?.id == station.id) {
                          actions.player.playing(false)
                        } else {
                          actions.player.playing(true)
                          actions.player.current_station(station)
                        }
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

                    <QueryLink to={generatePath(app_routes["station$id"], { id: station.id })} className="font-semibold text-secondary text-center station_name mb-1  text-hidden-overflow line-clamp-3">
                      {station.name}
                    </QueryLink>
                  </div>

                  <div className="station_tags_container text-center text-hidden-overflow line-clamp-2">
                    {
                      station.tags.map(tag => <StationTag tag={tag} />)
                    }
                  </div>
                </div>

              </div>

              <div className="flex flex-row flex-wrap align-items-start gap-1 overflow-hidden h-3rem">

                {
                  edit_mode ?
                    <>
                      <StationTag tag="Broadcasting" color={station.broadcasting ? 'green-400' : 'surface-300'} />

                      <StationTag tag="External" color={station.external && station.external_enable ? 'green-400' : 'surface-300'} />
                    </>
                    : <></>
                }
              </div>
            </div>
          )}

      </div>

    </div >
  )
}