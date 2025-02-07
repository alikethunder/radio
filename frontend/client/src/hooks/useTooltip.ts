import { useMemo, useCallback } from "react"

import { actions, } from "@/store"
import { v7 } from "uuid"

export const useTooltip = (ariaLabel: string): { "aria-label": string, "data-tooltip_targetid": string, onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void } => {

  const dataTargetid = useMemo(() => `_${v7()}`, [])

  const onMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const tooltip_target = (e.target as HTMLElement).closest('[data-tooltip_targetid]') as HTMLElement

    actions.app.hover_tooltip_targetid(tooltip_target?.dataset.tooltip_targetid ?? 'null')

    actions.app.hover_tooltip_content(tooltip_target?.ariaLabel ?? '')
  }, [])

  return {
    "aria-label": ariaLabel,
    "data-tooltip_targetid": dataTargetid,
    onMouseEnter,
  }
}