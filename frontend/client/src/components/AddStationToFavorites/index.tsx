import { FC, memo, useCallback, useMemo, } from "react"

import { Button } from 'primereact/button'

import {
  actions,
  useStore,
  store,
} from "@/store"

import { useTranslations } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"
import { update_json } from "@/API/profile/update_json"
import { Tooltip } from "primereact/tooltip"
import { tooltip_options } from "@/constants/tooltip_options"
import { v7 } from "uuid"
import { Station } from "@/types"

type Props = {
  station: Station;
  className?: string;
  "data-targetid"?: string;
}

export const AddStationToFavorites: FC<Props> = memo(({ station, className, "data-targetid": dataTargetid, ...rest }) => {

  const { id } = station

  const signedin = useStore().auth.signedin()

  const click_add_to_favorites = useCallback(useDebounceCallback(async (id) => {

    const signedin = store.auth.signedin()

    const anonym_favorite_station = store.persistedApp.favorite_station(id)

    const user_favorite_station = store.user.favorite_station(id)

    const favorite_station = signedin ? user_favorite_station : anonym_favorite_station

    actions.persistedApp.toggle_favorite_station(id)

    const likes = store.persistedApp.favorite_station(id) ? '+1' : '-1'
    //update station like count
    const resp = await fetch(`/api/v1/radio/update-likes/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        likes,
        uuid: signedin ? store.user.id() : store.persistedApp.user_uuid(),
      })
    })

    if (signedin) {
      actions.user.toggle_favorite_station(id)

      update_json({ favorite_stations: store.persistedApp.favorite_stations() })

    }

    if (!favorite_station) {
      //add new station to favorite list
      actions.session.add_stations_favorite([station])
    } else {
      //remove station from favorite list
      actions.session.remove_stations_favorite([station])
    }
  }, 50), [])

  const anonym_favorite_station = useStore().persistedApp.favorite_station(id)

  const user_favorite_station = useStore().user.favorite_station(id)

  const favorite_station = useMemo(() => signedin ? user_favorite_station : anonym_favorite_station, [
    signedin,
    anonym_favorite_station,
    user_favorite_station,
  ])

  const [translations] = useTranslations([
    'add_to_favorites',
  ], true)

  const targetid = useMemo(() => dataTargetid ?? v7(), [])

  return (
    <>
      <Button
        {...rest}
        icon={`pi ${favorite_station ? 'pi-star-fill' : 'pi-star'}`}
        rounded
        outlined
        raised
        aria-label={translations.add_to_favorites}
        className={`p-0 w-2rem h-2rem shadow_on_hover flex-shrink-0 ${className ?? ''}`}
        severity={`warning`}

        onClick={(e) => {
          e.preventDefault()
          click_add_to_favorites(id)
        }}

        data-targetid={targetid}
      />

      {
        dataTargetid ? <></> :
          <Tooltip target={`[data-targetid="${targetid}"]`} {...{ ...tooltip_options, position: 'top' }} >
            {translations.add_to_favorites}
          </Tooltip>
      }
    </>
  )
})