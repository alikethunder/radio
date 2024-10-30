import { FC, useMemo, } from "react"

import { Button } from 'primereact/button'

import {
  actions,
  useStore,
  store,
} from "@/store"

import { tooltip_options } from "@/constants/tooltip_options"
import { useTranslations } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"
import { update_json } from "@/API/profile/update_json"

type Props = {
  id: string;
}

export const AddStationToFavorites: FC<Props> = ({ id }) => {

  const signedin = useStore().auth.signedin()

  const click_add_to_favorites = useDebounceCallback(async (id) => {

    actions.persistedApp.toggle_favorite_station(id)

    const likes = store.persistedApp.favorite_station(id) ? '+1' : '-1'
    //update station like count
    const resp = await fetch(`/api/v1/radio/update-likes/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        likes,
      })
    })
    

    if (store.auth.signedin()) {
      actions.user.toggle_favorite_station(id)

      update_json({ favorite_stations: store.persistedApp.favorite_stations() })

    }
  }, 50)

  const anonym_favorite_station = useStore().persistedApp.favorite_station(id)

  const user_favorite_station = useStore().user.favorite_station(id)

  const favorite_station = useMemo(() => signedin ? user_favorite_station : anonym_favorite_station, [
    signedin,
    anonym_favorite_station,
    user_favorite_station,
  ])

  const [translations] = useTranslations([
    'play',
    'pause',
    'sitename',
    'add_to_favorites',
  ], true)

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

      onClick={() => click_add_to_favorites(id)}
    />
  )
}