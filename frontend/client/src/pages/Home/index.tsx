import { FC, useEffect, useMemo } from "react"

import {
  useLoaderData,
  generatePath,
} from "react-router-dom"

import { SmallCardContainer } from "@/layout parts"

import { QueryLink } from "@/components"
import './index.sass'

import {
  app_routes,
} from '@/constants/router'

import {
  store,
  useStore,
} from "@/store"

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



  return (
    <div className="sm:py-5 py-4 sm:px-6 px-4 w-full h-full overflow-y-auto page home_page flex-grow-1 flex flex-column">

      <div className="stations_list"
        //@ts-ignore
        style={{
          ...width ? {
            '--SmallCardContainer_width': `${width}px`,
            '--card-ratio': `${.25}`
          } : {}
        }}>

        <QueryLink to={generatePath(`${app_routes["station$id"]}/${'?edit'/* app_routes.edit */}`, { id: "new" })}>
          <SmallCardContainer className="flex flex-row overflow-hidden station_card create_station_card align-self-center shadow_on_hover">

            <div className="station_card_icon align-self-center flex align-items-center justify-content-center">
              <i className="pi pi-plus-circle" style={{ fontSize: '2rem' }}></i>
            </div>

            <div className="station_card_header align-self-center font-semibold flex-grow-1 text-center lobster_font">
              Create new radio
            </div>
          </SmallCardContainer>
        </QueryLink>

        {
          stations?.map(station =>
            <SmallCardContainer className="flex flex-row pt-1 overflow-hidden radio_card align-items-center">

              <div className="station_info">


                <div className="radio_card_icon"><i className="pi pi-folder-plus" style={{ fontSize: '2rem' }}></i></div>

                <div className="radio_card_header align-self-center font-semibold">
                </div>

              </div>
            </SmallCardContainer>
          )}

      </div>

    </div >
  )
}