import { RefObject, useRef } from "react"

import { Tooltip } from "primereact/tooltip"
import { TooltipOptions } from "primereact/tooltip/tooltipoptions"

export const useHideTooltip = (): TooltipOptions & { ref: RefObject<Tooltip> } => {

  const ref = useRef<Tooltip>(null)

  return {
    onShow: (e) => {
      setTimeout(() => {
        ref.current?.hide()
      }, 900)
    },
    ref,
  }
}