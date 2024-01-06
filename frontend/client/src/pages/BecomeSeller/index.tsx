import { FC, useEffect, useMemo } from "react"

import { Button } from 'primereact/button'

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

    const becomeSeller = async ()=>{
      const r = await fetch('/api/seller/start', {
        method: 'POST',
      })

      //const json = await r.json()
    }

  return (
    <div className="sm:py-5 py-4 sm:px-6 px-4 w-full overflow-y-auto page become_seller_page flex-grow-1"

      style={{
        ...width ? {
          '--SmallCardContainer_width': `${width}px`,
          '--card-ratio': `${1}`
        } : {}
      }}
    >
      {/* Заголовок - станьте продавцом и рекламируйте свои товары */}

      {/* Display current plan and dates and paid info */}

      <SmallCardContainer>

        <div className="card_header">
          Начальный
        </div>

        <div className="active_cards">
          Активных карточек {/*вопросик с всплывающей подсказкой - карточки которые отображаются пользователям */}
        </div>

        <div className="total_cards">
          Всего карточек {/*вопросик с всплывающей подсказкой - ваши карточки в том числе неактивные (которые не отображаются пользователям) */}
        </div>

        <Button
          label="Попробовать бесплатно"
          text
          raised
          icon="pi pi-sign-out"
          onClick={()=>becomeSeller()}
          iconPos="right"
          className="border-noround gray-800"
        />

      </SmallCardContainer>

      <SmallCardContainer />

      <SmallCardContainer />

      <SmallCardContainer />
      <SmallCardContainer />
      <SmallCardContainer />
      <SmallCardContainer />

    </div>
  )
}