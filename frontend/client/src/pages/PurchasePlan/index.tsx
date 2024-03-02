import { FC, useEffect, useMemo } from "react"

import { Button } from 'primereact/button'

import { CreateNewCard } from '@/components'

import { SmallCardContainer } from "@/layout parts"

import { QueryLink } from "@/components"

import './index.sass'

import { useTrackedStore } from "@/store"
import {
  useImmutableFetcher,
  sortByPriority,
} from "@/functions"

export const PurchasePlan = () => {

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const width = useMemo(() =>
    isDesktop ? windowSize.width * .25 : Math.min(windowSize.width, windowSize.height) * .7
    , [isDesktop, windowSize])

  const { error, data: plans, isLoading } = useImmutableFetcher('/api/v1/purchase-plan/get-plans')

  const sortedPlans = useMemo(() => plans?.sort(sortByPriority)/* .map(plan => {
    plan.options = [
      {
        name: 'projects',
        val: plan.options.projects
      },
      {
        name: 'users',
        val: plan.options.users
      },
      {
        name: 'components',
        val: plan.options.components
      }
    ] 
    return plan
  })*/, [plans])

  console.log('plans : ', plans, error, isLoading)

  const becomeSeller = async () => {
    /* const r = await fetch('/api/v1/purchase-plan/start', {
      method: 'POST',
    }) */

    //const json = await r.json()
  }




  return (
    <div
      className="sm:py-5 py-4 sm:px-6 px-4 w-full overflow-y-auto page become_seller_page flex-grow-1 flex flex-column"
      //@ts-ignore
      style={{
        ...width ? {
          '--SmallCardContainer_width': `${width}px`,
          '--card-ratio': `${1}`
        } : {}
      }}
    >

      <div className=" align-self-center sm:text-3xl lg:text-5xl lg:w-7 w-11 mb-5 text-center font-semibold">
        Преобразите свой проект современной документацией
      </div>

      <div className="plans">

        {/* TODO: If present display current plan and dates and paid info */}
        {
          sortedPlans?.map((plan: any) =>

            <SmallCardContainer className="flex flex-column pt-1">

              <div className="card_header align-self-center font-semibold">
                {plan.name}
              </div>

              <div className="options">
                {
                  plan.options.sort(sortByPriority).map((option: any) =>
                    <div className="option">
                      <div className="option_name">
                        {option.name}
                        {/*вопросик с всплывающей подсказкой*/}
                      </div>

                      <div className="option_val">
                        {option.value}
                      </div>
                    </div>
                  )
                }

              </div>

              <div className="buttons">
                {
                  plan.name == 'free' ?
                    <Button
                      label="Попробовать бесплатно"
                      text
                      raised
                      onClick={() => becomeSeller()}
                      className="border-noround mt-auto align-self-stretch bg-primary"
                    /> :
                    plan.prices.sort(sortByPriority).map((price: any) =>
                      <Button
                        label={`${price.name} за ${price.value}$`}
                        text
                        raised
                        onClick={() => becomeSeller()}
                        className="border-noround mt-auto align-self-stretch bg-primary"
                      />
                    )
                }
              </div>



            </SmallCardContainer>
          )
        }

      </div>

    </div>
  )
}