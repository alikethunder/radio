import { FC, LegacyRef, useEffect, useRef, useState } from "react"

import {
  generatePath,
} from "react-router-dom"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import {
  actions,
  useStore,
  store,
} from "@/store"

import {
  app_routes,
  auth_routes,
  route_attributes,
} from '@/constants/router'

import {
  StationTag,
  QueryLink,
} from '@/components'

import { tooltip_options } from "@/constants/tooltip_options"
import { classNames } from "primereact/utils"
import { NumRange } from "@/types/generics/range"
import { useTranslation, useTranslations } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"

const tltp_options = { ...tooltip_options, position: 'top' } as const

export const AddStationToFavorites: FC = () => {

  const click_add_to_favorites = useDebounceCallback(async (station_id) => {

    actions.persistedApp.toggle_favorite_station(station_id)

    if (signedin) {
      actions.user.toggle_favorite_station(station_id)
      update_json({ favorite_stations: store.persistedApp.favorite_stations() })
    }
  }, 50)

  const anonym_favorite_station = useStore().persistedApp.favorite_station(station.id)

  const user_favorite_station = useStore().user.favorite_station(station.id)

  const favorite_station = useMemo(() => signedin ? user_favorite_station : anonym_favorite_station, [
    signedin,
    anonym_favorite_station,
    user_favorite_station,
  ])
  return (
    <Button
      icon={`pi ${favorite_station ? 'pi-star-fill' : 'pi-star'}`}
      rounded
      outlined
      raised
      aria-label={translations.add_to_favorites}
      tooltip={translations.add_to_favorites}
      tooltipOptions={tooltip_options}
      className={`p-0 w-2rem h-2rem shadow_on_hover flex-shrink-0`}
      severity={`warning`}

      onClick={() => click_add_to_favorites(station.id)}
    />
  )
}