import { FC, useCallback, useEffect, useMemo } from "react"

import {
  useNavigate,
} from "react-router-dom"

import { Button } from 'primereact/button'

import { CreateNewCard } from '@/components'

import { SmallCardContainer } from "@/layout parts"

import { QueryLink } from "@/components"

import './index.sass'

import {
  store,
  useTrackedStore,
} from "@/store"

import {
  sortByPriority,
} from "@/functions"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Tooltip } from "primereact/tooltip"

import {
  app_routes,
} from '@/constants/router'

export const PurchasePlan = () => {

  const navigate = useNavigate()

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const width = useMemo(() =>
    isDesktop ? windowSize.width * .25 : Math.min(windowSize.width, windowSize.height) * .7
    , [isDesktop, windowSize])

  const plans = useTrackedStore().app.subscription_plans()

  const sortedPlans = useMemo(() => plans?.sort(sortByPriority), [plans])

  console.log('plans : ', plans)

  const becomeSeller = async () => {
    /* const r = await fetch('/api/v1/purchase-plan/start', {
      method: 'POST',
    }) */

    //const json = await r.json()
  }

  const planOptions = useCallback((plan: any) => {
    return plan.options.sort(sortByPriority).map((option: any) => {
      option.explanation = <i className={`question pi pi-question-circle`}
        data-pr-tooltip={`test text ${option.priority}`}
      />
      return option
    })
  }, [])

  const subscription_plan = useTrackedStore().user.subscription_plan()

  const planIsNotExpired = useMemo(() => Boolean(
    subscription_plan?.ends && new Date(subscription_plan?.ends).getTime() - new Date().getTime() > 0
  ), [subscription_plan])

  return (
    <div
      className="sm:py-5 py-4 sm:px-6 px-4 w-full overflow-y-auto page become_seller_page flex-grow-1 flex flex-column"
      //@ts-ignore
      style={{
        ...width ? {
          '--SmallCardContainer_width': `${width}px`,
          '--card-ratio': `${1.2}`
        } : {}
      }}
    >

      <div className=" align-self-center sm:text-3xl lg:text-5xl lg:w-7 w-11 mb-5 text-center font-semibold">
        Преобразите свой проект современной документацией
      </div>

      <div className="plans">

        {
          sortedPlans?.map((plan: any) =>

            <SmallCardContainer className="flex flex-column pt-1 overflow-hidden">

              <div className="card_header align-self-center font-semibold">
                {plan.name}
              </div>

              <Tooltip target={`.question`} />

              <DataTable value={planOptions(plan)} showHeaders={false} size="small">
                <Column field="name" header="" />
                <Column field="value"
                  header=""
                  align={'center'} />
                <Column field="explanation"
                  header=""
                  style={{
                    width: '24px'
                  }}
                  align={'center'} />
              </DataTable>

              <div className="active_plan my-auto text-center p-2">
                {
                  store.auth.signedin()
                    && (
                      !subscription_plan?.name ?
                        plan.name == 'free'
                        :
                        !planIsNotExpired
                    )
                    ?
                    <>
                      Вы пользуетесь этим планом
                    </>
                    : ''
                }

                {
                  store.auth.signedin()
                    && plan.name == subscription_plan?.name ?
                    planIsNotExpired ?
                      <>
                        Вы пользуетесь этим планом до {subscription_plan?.ends}
                      </>
                      :
                      <>
                        Вы пользовались этим планом до {subscription_plan?.ends}
                      </>
                    : ''
                }
              </div>

              <div className="buttons flex flex-column">
                {
                  plan.name == 'free' ?
                    <Button
                      label="Бесплатный план"
                      text
                      raised
                      className="border-noround mt-auto align-self-stretch bg-primary"
                    /> :
                    plan.prices.sort(sortByPriority).map((price: any, i: number) =>
                      <Button
                        label={`${price.name} за ${price.value}$`}
                        text
                        raised
                        onClick={() => {
                          store.auth.signedin() ? becomeSeller() : navigate(app_routes.signin)
                        }}
                        className={`border-noround mt-2 align-self-stretch ${i == 0 ? 'bg-secondary text-white' : 'bg-primary'}`}
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