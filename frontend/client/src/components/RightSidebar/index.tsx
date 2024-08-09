import { FC, useEffect } from "react"

import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'

import {
  QueryLink,
} from '@/components/QueryLink'

import {
  logout,
} from '@/functions'

import {
  app_routes,
} from '@/constants/router'

import { actions, useTrackedStore } from "@/store"

import './index.sass'
import { generatePath } from "react-router-dom"

export const RightSidebar: FC = () => {

  const rightSidebarOpened = useTrackedStore().app.rightSidebarOpened()

  const subscription_plan = useTrackedStore().user.subscription_plan()

  //const new_project_url = 

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

        <div className="flex">
          <Button
            //todo: projects quantity like "My projects (5)"
            label="Мои компании"
            text
            raised
            //onClick={logout}
            className="border-noround w-full h-full px-2"
          />
          <Button
            text
            raised
            //todo: switch to pi-chevron-up when opened projects list
            icon={`pi pi-chevron-down`}
            //onClick={logout}
            className="border-noround h-full px-2"
          />
        </div>

        <QueryLink to={generatePath(app_routes.project$id, { id: 'new' })} onClick={() => actions.app.rightSidebarOpened(false)}>
          <Button
            //@ts-ignore
            label="Создать компанию"
            text
            raised
            icon={`pi pi-plus`}
            iconPos="right"
            //onClick={logout}
            className="border-noround w-full h-full px-2 text-secondary"
          />
        </QueryLink>
        <div className="flex flex-column shadow-4">

        </div>



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