import { FC, useCallback, useEffect, useMemo } from "react"

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
  useImmutableFetcher,
  sortByPriority,
} from "@/functions"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Tooltip } from "primereact/tooltip"

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

  const planOptions = useCallback((plan: any) => {
    return plan.options.sort(sortByPriority).map((option: any) => {
      option.explanation = <i className={`question pi pi-question-circle`}
        data-pr-tooltip={`test text ${option.priority}`}
      />
      return option
    })
  }, [])

  const signedin = useTrackedStore().auth.signedin()

  const { error: getUserPlanErr, data: userPlan, isLoading: userPlanIsLoading } = useImmutableFetcher(signedin ? '/api/v1/purchase-plan/get-user-plan' : null)

  console.log('user plan : ', userPlan)

  const planIsNotExpired = useMemo(() => Boolean(
    userPlan?.subscription_plan_ends && new Date(userPlan?.subscription_plan_ends).getTime() - new Date().getTime() > 0
  ), [userPlan])

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

        {
          sortedPlans?.map((plan: any) =>

            <SmallCardContainer className="flex flex-column pt-1">

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

              <div className="active_plan">
                {
                  store.auth.signedin()
                    && (
                      !userPlan?.subscription_plan ?
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
                    && plan.name == userPlan?.subscription_plan ?
                    planIsNotExpired ?
                      <>
                        Вы пользуетесь этим планом до {userPlan?.subscription_plan_ends}
                      </>
                      :
                      <>
                        Вы пользовались этим планом до {userPlan?.subscription_plan_ends}
                      </>
                    : ''
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