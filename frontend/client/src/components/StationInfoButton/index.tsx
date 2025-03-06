import { FC, memo, useCallback, useMemo, } from "react"

import { Button } from 'primereact/button'

import {
  actions,
} from "@/store"

import { useTooltip, useTranslations } from "@/hooks"
import { Station } from "@/types"
import { RiInfoCardLine } from "react-icons/ri"
import { ga_event } from "@/functions"
import './index.sass'

type Props = {
  station: Station;
  className?: string;
}

export const StationInfoButton: FC<Props> = memo(({ station, className, ...rest }) => {

  const [translations] = useTranslations([
    'about_station',
  ], true)

  const open_station_info = useCallback(() => {
    actions.app.station_info_dialog(station)

    ga_event({
      event: 'station_info',
      station: {
        id: station.id,
        name: station.name,
      },
    })
  }, [station.id])

  const tooltip = useTooltip(translations.about_station)

  return (
    <Button
      rounded
      outlined
      raised
      className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center text-600 ${className ?? ''}`}

      onClick={open_station_info}

      {...tooltip}
    >
      <RiInfoCardLine className="station_info_icon_size" />
    </Button>
  )
}, (o, n) => {
  return o.station.id == n.station.id
    && o.className == n.className
})