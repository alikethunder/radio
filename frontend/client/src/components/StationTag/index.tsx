import { FC, useCallback, useEffect } from "react"

import { Tag } from 'primereact/tag'

import { classNames } from 'primereact/utils'

export const StationTag: FC<{ tag: string }> = ({ tag }) => {

  const get_random_color = useCallback(() => {
    return 
  }, [])

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
            `bg-${get_random_color()}`,
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