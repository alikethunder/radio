import { FC, useEffect } from "react"

import { Tag } from 'primereact/tag'

import { classNames } from 'primereact/utils'

const tags_colors = [
  'blue-700',
  'green-700',
  'yellow-700',
  'cyan-700',
  'indigo-700',
  'teal-600',
  'orange-600',
  'red-600'
] as const

const get_random_from_length = (length: number) => {
  return length ?
    Math.floor(Math.random() * length)
    : 0
}

const get_random_color = () => {
  return tags_colors[get_random_from_length(tags_colors.length)]
}

export const StationTag: FC<{ tag: string }> = ({ tag }) => {

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