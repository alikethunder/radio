import { FC, useCallback, useEffect, useMemo } from "react"

import { Tag } from 'primereact/tag'

import { classNames } from 'primereact/utils'
import { useStore } from "@/store"

export const StationTag: FC<{ tag: string }> = ({ tag }) => {

  const color = useStore().app.get_station_tag(tag)?.color

  return (
    <Tag
      value={tag}
      pt={{
        root: {
          className: classNames({},
            'py-05',
            //'px-1',
            'cursor-default',
            'select-none',
            `bg-${color}`,
            'shadow-2',
          ),
          style: {
            lineHeight: 1.25,
          }
        },
      }}
    />
  )
}