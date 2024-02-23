import { FC, useEffect, useMemo } from "react"

import { Button } from 'primereact/button'

import { CreateNewCard } from '@/components'

import { SmallCardContainer } from "@/layout parts"

import { QueryLink } from "@/components"

import './index.sass'

import { useTrackedStore } from "@/store"
import { useFetcher } from "@/functions/fetcher"

export const PurchasePlan = () => {

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const width = useMemo(() =>
    isDesktop ? windowSize.width * .25 : Math.min(windowSize.width, windowSize.height) * .7
    , [isDesktop, windowSize])

  const {error, data: plans, isLoading} = useFetcher('/api/v1/purchase-plan/get-plans')

  console.log('plans : ', plans, error)

  const becomeSeller = async () => {
    /* const r = await fetch('/api/v1/purchase-plan/start', {
      method: 'POST',
    }) */

    //const json = await r.json()
  }

  

 
  return (
    <div
      className="sm:py-5 py-4 sm:px-6 px-4 w-full overflow-y-auto page become_seller_page flex-grow-1 flex flex-column"

      style={{
        ...width ? {
          '--SmallCardContainer_width': `${width}px`,
          '--card-ratio': `${1}`
        } : {}
      }}
    >

      <div className=" align-self-center sm:text-3xl lg:text-5xl lg:w-7 w-11 mb-5 text-center font-semibold">
        Хотите стать продавцом и рекламировать свои товары и услуги?
      </div>


      <div className="plans">

        {/* TODO: If present display current plan and dates and paid info */}

        <SmallCardContainer className="flex flex-column pt-1">

          <div className="card_header align-self-center font-semibold">
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
            onClick={() => becomeSeller()}
            className="border-noround mt-auto align-self-stretch bg-primary"
          />

        </SmallCardContainer>

        <SmallCardContainer />

        <SmallCardContainer />

        <SmallCardContainer />
        <SmallCardContainer />
        <SmallCardContainer />
        <SmallCardContainer />
      </div>

    </div>
  )
}