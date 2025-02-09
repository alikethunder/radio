import { FC, memo, useCallback, useState, } from "react"

import { Button } from 'primereact/button'

import {
  store,
} from "@/store"

import { useTooltip, useTranslations } from "@/hooks"
import { Station } from "@/types"
import { FaRegShareFromSquare } from "react-icons/fa6"
import { get_station_description } from "@/API/station/get_station_description"

type Props = {
  station: Station;
  className?: string;
}

export const StationShareButton: FC<Props> = memo(({ station, className, ...rest }) => {

  const [loading, set_loading] = useState(false)

  const [translations] = useTranslations([
    'share',
  ], true)

  const share_station = useCallback(async () => {
    if (station) {
      set_loading(true)

      const language = store.translations.language() ?? 'en'

      const text = await get_station_description(station.id, language)

      const shareData = {
        title: station.name,
        text,
        url: `https://radio.best/station/${station.id}`,
      }

      try {
        await navigator.share(shareData);
      } catch (e) {
        console.error('[StationShareButton] share error :', e)
      }
      set_loading(false)
    }
  }, [station.id])

  const tooltip = useTooltip(translations.share)

  return (
    <Button
      rounded
      outlined
      raised
      className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center`}
      severity={`info`}
      disabled={loading}
      onClick={share_station}
      {...tooltip}

    >
      {
        loading ?
          <i className="pi pi-spin pi-spinner" />
          :
          <FaRegShareFromSquare />
      }
    </Button>
  )
}, (o, n) => {
  return o.station.id == n.station.id
    && o.className == n.className
})