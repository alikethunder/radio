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
        <QueryLink to="/purchase-plan" onClick={() => actions.app.rightSidebarOpened(false)}>
          <Button
            label="Upgrade a plan"
            severity="info"
            text
            raised
            icon="pi pi-book"
            iconPos="right"
            className="border-noround w-full h-full text-left"
          />
        </QueryLink>



      </div>

      <div className="bottom flex flex-column">

        <Button
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
          //onClick={logout}
          className="border-noround"
        />

        <div className="flex flex-column shadow-1">
          <div className="plan_name_and_date">

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