import { FC, memo, } from "react"

import {
  useStore,
} from "@/store"

import { Tooltip } from "primereact/tooltip"

import { tooltip_options } from "@/constants/tooltip_options"
import { useHideTooltip } from "@/hooks"

export const DynamicTooltip: FC = memo(() => {

  const hover_tooltip_targetid = useStore().app.hover_tooltip_targetid()

  const hover_tooltip_content = useStore().app.hover_tooltip_content()

  const hide_options = useHideTooltip()

  return (
    hover_tooltip_targetid ?
      <Tooltip
        target={`[data-tooltip_targetid=${hover_tooltip_targetid}]`}
        {...{ ...tooltip_options, ...hide_options}}
      >
        {hover_tooltip_content}
      </Tooltip>
      : <></>
  )
})