import { FC, memo, } from "react"

import { ProgressSpinner } from 'primereact/progressspinner'

export const StationsLoadSpinner: FC = memo(() => {

  return (
    <ProgressSpinner className="w-3rem h-3rem my-8 mx-6" strokeWidth="3" fill="var(--surface-ground)" animationDuration=".7s" />
  )
})