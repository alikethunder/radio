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
  route_attributes,
} from '@/constants/router'

import {
  actions,
  useTrackedStore,
  useStore,
  store,
} from "@/store"

import './index.sass'
import { generatePath } from "react-router-dom"

export const RightSidebar: FC = () => {

  const rightSidebarOpened = useTrackedStore().app.rightSidebarOpened()

  const subscription_plan = useTrackedStore().user.subscription_plan()

  //const new_project_url = 

  const signedin = useStore().auth.signedin()

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
        {
          signedin ?
            <>
              <QueryLink to={generatePath(app_routes.user_profile$id, { id: store.user.id() })} onClick={() => actions.app.rightSidebarOpened(false)}>
                <Button
                  label={route_attributes[app_routes.user_profile$id].name}
                  text
                  raised
                  icon={`pi ${route_attributes[app_routes.user_profile$id].icon} text-xl md:text-2xl`}
                  className="border-noround w-full h-full px-2 text-secondary lobster_font text-xl shadow_on_hover"
                />
              </QueryLink>

              <div className="flex">
                <Button
                  //todo: projects quantity like "My projects (5)"
                  label="Мои компании"
                  text
                  raised
                  icon='pi pi-briefcase text-xl md:text-2xl'
                  className="border-noround w-full h-full px-2 lobster_font text-xl shadow_on_hover"
                />
                <Button
                  text
                  raised
                  //todo: switch to pi-chevron-up when opened projects list
                  icon={`pi pi-chevron-down`}
                  //onClick={logout}
                  className="border-noround h-full px-2 shadow_on_hover"
                />
              </div>
            </>
            :
            <QueryLink to={app_routes.signin} onClick={() => actions.app.rightSidebarOpened(false)}>
              <Button
                label="Войти"
                text
                raised
                icon={`pi pi-sign-in`}
                iconPos="right"
                className="border-noround w-full h-full px-2 text-secondary shadow_on_hover lobster_font text-xl"
              />
            </QueryLink>
        }
        {/* <QueryLink to={generatePath(app_routes.project$id, { id: 'new' })} onClick={() => actions.app.rightSidebarOpened(false)}>
          <Button
            label="Создать компанию"
            text
            raised
            icon={`pi pi-plus`}
            iconPos="right"
            //onClick={logout}
            className="border-noround w-full h-full px-2 text-secondary"
          />
        </QueryLink> */}
        <div className="flex flex-column shadow-4">

        </div>



      </div>

      <div className="bottom flex flex-column">
        {
          signedin ?
            <Button
              label="Выйти"
              text
              raised
              icon="pi pi-sign-out"
              onClick={() => {
                logout();
                actions.app.rightSidebarOpened(false)
              }}
              iconPos="right"
              className="border-noround gray-800 text-left lobster_font text-xl shadow_on_hover"
            />
            : <></>
        }
      </div>

    </Sidebar>
  )
}