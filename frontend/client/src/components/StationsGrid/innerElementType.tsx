import { forwardRef, LegacyRef } from "react"
import { gap } from './constants'

export const innerElementType = forwardRef(({ style, children, ...rest }: {
  style: {
    [x: string]: any
  },
  children: any
}, ref: LegacyRef<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        height: `${parseFloat(style.height) + 2 * (children[0]?.props?.data?.py ?? 32) - gap}`
      }}
      children={children}
      {...rest}
    />
  )
})