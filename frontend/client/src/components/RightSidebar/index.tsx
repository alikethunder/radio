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