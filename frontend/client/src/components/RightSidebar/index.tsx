import { FC, useEffect } from "react"

import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'

import {
  QueryLink,
} from '@/components/QueryLink'

import {
  logout,
} from '@/functions'

import { actions, useTrackedStore } from "@/store"

import './index.sass'

export const RightSidebar: FC = () => {

  const rightSidebarOpened = useTrackedStore().app.rightSidebarOpened()

  const subscription_plan = useTrackedStore().user.subscription_plan()

  return (
    <Sidebar
      visible={rightSidebarOpened}
      position="right"
      onHide={() => actions.app.rightSidebarOpened(false)}
      className="w-15rem"
      showCloseIcon={false}
      pt={{
        root: {
          className: 'right_sidebar'
        },
        header: {
          style: {
            display: 'none'
          }
        },
        content: {
          className: 'flex flex-column justify-content-between p-0'
        }
      }}
    >
      <div className="top flex flex-column">
        <Button
          //todo: projects quantity like "My projects (5)"
          //@ts-ignore
          label="My projects"
          text
          raised
          icon={`pi pi-caret-down`}
          iconPos="right"
          //onClick={logout}
          className="border-noround w-full h-full px-2"
        />
        <Button
          //@ts-ignore
          label="Create new"
          text
          raised
          icon={`pi pi-plus`}
          iconPos="right"
          //onClick={logout}
          className="border-noround w-full h-full px-2 text-secondary"
        />
        <div className="flex flex-column shadow-4">

        </div>



      </div>

      <div className="bottom flex flex-column">
        <QueryLink to="/purchase-plan" onClick={() => actions.app.rightSidebarOpened(false)}>
          <Button
            //@ts-ignore
            label={
              <div className="flex justify-content-between">
                <span>
                  Current plan
                </span>
                <span className="text-green-600">
                  <i className="pi pi-angle-double-up fadeindown animation-duration-2000 animation-iteration-infinite" />
                  <span className="upgrade">
                    Upgrade
                  </span>
                  <i className="pi pi-angle-double-up fadeindown animation-duration-1000 animation-iteration-infinite animation-delay-300" />
                </span>
              </div>
            }
            text
            raised
            icon="pi pi-book"
            //onClick={logout}
            className="border-noround w-full h-full px-2"
          />
        </QueryLink>

        <div className="flex flex-column shadow-4">
          <div className="plan_name_and_date">
            <div className="name pl-5 capitalize py-2">
              {subscription_plan.name || 'free'}
            </div>
            <div className="date">
              {
                subscription_plan.ends
                || ''
              }
            </div>
          </div>
          <div className="plan_details">

          </div>

        </div>

        <Button
          label="Logout"
          text
          raised
          icon="pi pi-sign-out"
          onClick={logout}
          iconPos="right"
          className="border-noround gray-800 text-left"
        />
      </div>

    </Sidebar>
  )
}