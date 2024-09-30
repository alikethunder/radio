import { FC, useCallback, useEffect, useMemo } from "react"

import { Tag } from 'primereact/tag'

import { classNames } from 'primereact/utils'

import { useDebounceCallback } from "usehooks-ts"

import {
  actions,
  store,
  useStore,
} from "@/store"

type Props = {
  tag: string;
  color?: string;
  onClick?: () => void;
  disable_link?: boolean;
}

export const StationTag: FC<Props> = ({ tag, color, onClick, disable_link }) => {

  const result_color = color ?? useStore().app.get_station_tag(tag)?.color

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const tag_is_in_search = useMemo(() => search_station_tags.includes(tag), [search_station_tags])

  const click = useDebounceCallback((e) => {
    if (onClick) {
      onClick()
    }

    if (!disable_link) {

      actions.persistedApp.add_tag_to_search(tag)
    }
  }, 100)

  return (
    <Tag
      value={tag}
      onClick={click}
      pt={{
        root: {
          className: classNames({
            'opacity-0': (color ?? 'nullish') != 'nullish' && !color?.length,
            'cursor-pointer shadow_on_hover shadow-2': !tag_is_in_search && !disable_link,
          },
            'py-05',
            'select-none',
            color?.includes('surface') ? color : `bg-${result_color}`,
            'text-sm',
            'font-medium',
            `${disable_link ? '' : (tag_is_in_search ? 'opacity-70' : '')}`
          ),
          style: {
            color: `var(--${result_color})`,
          }
        },
        value: {
          className: classNames({

          },
          ),
          style: {
            lineHeight: 1.25,
            color: 'white',
          }
        }
      }}
    />
  )
}