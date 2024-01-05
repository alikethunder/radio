import { FC, useEffect, useMemo } from "react"

import { CreateNewCard } from '@/components'

import { SmallCardContainer } from "@/layout parts"

import { QueryLink } from "@/components"
import './index.sass'
import { useTrackedStore } from "@/store"

export const BecomeSeller = () => {

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const width = useMemo(() =>
    isDesktop ? windowSize.width * .25 : Math.min(windowSize.width, windowSize.height) * .7
    , [isDesktop, windowSize])

  return (
    <div className="sm:py-5 py-4 sm:px-6 px-4 w-full overflow-y-auto page become_seller_page flex-grow-1"
    
    style={{
      ...width ? {
        '--SmallCardContainer_width': `${width}px`,
        '--card-ratio': `${2}`
      } : {}
    }}
    >

      <SmallCardContainer/>

      <SmallCardContainer/>

      <SmallCardContainer />

      <SmallCardContainer />
      <SmallCardContainer />
      <SmallCardContainer />
      <SmallCardContainer />

    </div>
  )
}