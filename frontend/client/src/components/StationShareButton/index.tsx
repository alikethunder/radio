import { FC, memo, useCallback, useState, } from "react"

import { Button } from 'primereact/button'

import { useTooltip, useTranslations } from "@/hooks"
import { Station } from "@/types"
import { FaRegShareFromSquare } from "react-icons/fa6"
import { ga_event } from "@/functions"

type Props = {
  station: Station;
  className?: string;
}

export const StationShareButton: FC<Props> = memo(({ station, className, ...rest }) => {

  const [loading, set_loading] = useState(false)

  const [translations] = useTranslations([
    'share_station',
  ], true)

  const share_station = useCallback(async () => {
    if (station) {
      set_loading(true)

      const shareData = {
        title: station.name,
        url: `https://radio.best/station/${station.id}`,
      }

      try {
        await navigator.share(shareData);

        ga_event({
          event: 'share_station',
          station: {
            id: station.id,
            name: station.name,
          }
        })
      } catch (e) {
        console.error('[StationShareButton] share error :', e)

        ga_event({
          event: 'share_station_error',
          station: {
            id: station.id,
            name: station.name,
          },
          error: e,
        })
      }
      set_loading(false)
    }
  }, [station.id])

  const tooltip = useTooltip(translations.share_station)

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