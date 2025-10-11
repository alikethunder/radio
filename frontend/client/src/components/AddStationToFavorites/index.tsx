import { FC, memo, useCallback, useEffect, useMemo, useState, } from "react"

import { Button } from 'primereact/button'

import {
  actions,
  useStore,
  store,
} from "@/store"

import { useTooltip, useTranslations } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"
import { update_json } from "@/API/profile/update_json"
import { v7 } from "uuid"
import { Station } from "@/types"
import { useAsyncMemo } from "use-async-memo"
import { ga_event, get_api_origin } from "@/functions"

type Props = {
  station: Station;
  className?: string;
  show_likes?: boolean;
}

export const AddStationToFavorites: FC<Props> = memo(({ station, className, show_likes, ...rest }) => {

  const { id } = station

  const [likes, set_likes] = useState<number | null>(null)

  const signedin = useStore().auth.signedin()

  useEffect(() => {
    if (show_likes && id) {
      (async () => {
        const resp = await fetch(`${get_api_origin()}/api/v1/radio/likes/${id}`)
        const text = await resp.text()
        //console.log('[AddStationToFavorites] likes : ', text)
        set_likes(Number(text))
      })()
    }
  }, [id])

  const click_add_to_favorites = useCallback(useDebounceCallback(async (id) => {

    const signedin = store.auth.signedin()

    const anonym_favorite_station = store.persistedApp.favorite_station(id)

    const user_favorite_station = store.user.favorite_station(id)

    const favorite_station = signedin ? user_favorite_station : anonym_favorite_station

    if (signedin) {
      actions.user.toggle_favorite_station(id)
    } else {
      actions.persistedApp.toggle_favorite_station(id)
    }

    const likes = favorite_station ? '-1' : '+1'
    //update station like count
    const resp = await fetch(`${get_api_origin()}/api/v1/radio/update-likes/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        likes,
        uuid: signedin ? store.user.id() : store.persistedApp.user_uuid(),
      })
    })

    const text = await resp.text()

    //console.log('[AddStationToFavorites] likes : ', text)
    set_likes(Number(text))
    if (signedin) {
      update_json({ favorite_stations: store.user.favorite_stations() })
    }

    ga_event({
      event: 'add_to_favorites',
      action: favorite_station ? 'remove' : 'add',
      station: {
        id,
        name: station.name,
      },
    })
  }, 50), [id])

  const anonym_favorite_station = useStore().persistedApp.favorite_station(id)

  const user_favorite_station = useStore().user.favorite_station(id)

  const favorite_station = useMemo(() => signedin ? user_favorite_station : anonym_favorite_station, [
    signedin,
    anonym_favorite_station,
    user_favorite_station,
  ])

  const [translations] = useTranslations([
    'add_to_favorites',
    'remove_from_favorites',
  ], true)

  const ariaLabel = useMemo(() => favorite_station ? translations.remove_from_favorites : translations.add_to_favorites, [
    favorite_station,
    translations.add_to_favorites,
    translations.remove_from_favorites,
  ])

  const tooltip = useTooltip(ariaLabel)

  return (
    <Button
      {...rest}
      icon={`pi ${favorite_station ? 'pi-star-fill' : 'pi-star'}`}
      rounded
      outlined
      raised
      className={`p-0 w-2rem h-2rem shadow_on_hover flex-shrink-0 ${className ?? ''}`}
      severity={`warning`}

      onClick={(e) => {
        e.preventDefault()
        click_add_to_favorites(id)
      }}

      {...tooltip}

    />
  )
}, (o, n) => {
  return o.station.id == n.station.id
    && o.className == n.className
})