import { FC, useCallback, useEffect, useMemo } from "react"

import { Tag } from 'primereact/tag'

import { classNames } from 'primereact/utils'
import { useStore } from "@/store"

type Props = {
  tag: string;
  color?: string;
  onClick?: () => void;
}

export const StationTag: FC<Props> = ({ tag, color, onClick }) => {

  const result_color = color ?? useStore().app.get_station_tag(tag)?.color

  return (
    <Tag
      value={tag}
      {...onClick ? { onClick } : {}}
      pt={{
        root: {
          className: classNames({
            'opacity-0': (color ?? 'nullish') != 'nullish' && !color?.length
          },
            'py-05',
            'cursor-pointer',
            'select-none',
            color?.includes('surface') ? color : `bg-${result_color}`,
            'shadow-2',
            'text-sm',
            'font-medium',
          ),
        },
        value: {
          style: {
            lineHeight: 1.25,
          }
        }
      }}
    />
  )
}