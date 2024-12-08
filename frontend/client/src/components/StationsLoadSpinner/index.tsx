import { FC, memo, } from "react"

import { ProgressSpinner } from 'primereact/progressspinner'

type Props = {
  style: {
    [x: string]: any;
  }
}

export const StationsLoadSpinner: FC<Props> = memo(({ style }) => {

  return (
    <ProgressSpinner className="w-3rem h-3rem my-8 mx-6" strokeWidth="3" fill="var(--surface-ground)" animationDuration=".7s" style={style} />
  )
})