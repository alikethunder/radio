import { FC, useEffect, useState } from "react"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import { actions, useStore } from "@/store"

import {
  app_routes,
  auth_routes,
  route_attributes,
} from '@/constants/router'

import {
  FormActionsState,
  QueryLink,
} from '@/components'

import { icon_classes } from "@/constants/icon_classes"

import { tooltip_options } from "@/constants/tooltip_options"

export const Player: FC = () => {

  const current_page = useStore().app.current_page()

  const [playing, set_playing] = useState(false)

  //console.log('navbar_actions : ', navbar_actions)

  return (
    <div className="flex flex-shrink-0 shadow-3 h-5rem sm:h-5rem justify-content-center bg-white py-2">

      <div className="flex flex-column">

        <div className="player_main_content flex flex-row gap-3">

          <div className="player_station_avatar w-4rem h-4rem shadow-2 bg-no-repeat bg-contain bg-center flex-shrink-0 border-round-xl">
            {/* current station avatar */}
          </div>

          <Button
            className="shadow_on_hover p-0 mt-2 flex-shrink-0"

            rounded
            outlined
            raised
            aria-label="Play"
            tooltip="Play"
            severity="info"
            tooltipOptions={{ ...tooltip_options, position: 'top' }}
            icon={`pi text-2xl ${playing ? 'pi-pause' : 'pi-play'}`}

            pt={{
              icon: {
                style: {
                  paddingLeft: playing ? '0' : '2px',
                }
              }
            }}

            onClick={() => set_playing(p => !p)}
          />

          <div className="flex flex-column">

            <div className="player_station">
              {/* current station name */}

              {/*  likes*/}

              {/* listeners */}
            </div>

            <div className="player_track">
              {/* current artist - track name */}

              {/* likes */}

              {/* downloads  if downloadable */}
            </div>

            <div className="player_station_tags">
              {/* current station tags (clickable, opens the main page with search with clicked tag)  */}
            </div>

          </div>

          <div className="flex flex-column">
            {/* history button */}

            {/* random station */}

            {/* random with similar tag */}
          </div>


        </div>


        <div className="volume">

        </div>
      </div>


    </div>
  )
}