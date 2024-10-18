import { FC, useEffect } from "react"

import { Button } from 'primereact/button'

import { Sidebar } from 'primereact/sidebar'

import { Dropdown } from 'primereact/dropdown'

import {
  QueryLink,
} from '@/components'

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

import { icon_classes } from "@/constants/icon_classes"
import { classNames } from "primereact/utils"

import { Translation } from "@/layout parts"

export const RightSidebar: FC = () => {

  const rightSidebarOpened = useTrackedStore().session.rightSidebarOpened()

  const subscription_plan = useTrackedStore().user.subscription_plan()

  //const new_project_url = 

  const signedin = useStore().auth.signedin()

  const language = useStore().persistedApp.language()

  const languages = useStore().persistedApp.languages()

  return (
    <Sidebar
      visible={rightSidebarOpened}
      position="right"
      onHide={() => actions.session.rightSidebarOpened(false)}
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

        <Dropdown
          value={language}
          onChange={(e) => actions.persistedApp.language(e.value)}
          options={languages}
          optionLabel="name"
          className="w-full border-noround border-none"
          checkmark
          pt={{
            list: {
              className: classNames({},
                'p-0',
              )
            }
          }}
        />

        {
          signedin ?
            <>
              <QueryLink to={generatePath(app_routes.user_profile$id, { id: store.user.id() })} onClick={() => actions.session.rightSidebarOpened(false)}>
                <Button
                  label={route_attributes[app_routes.user_profile$id].name as unknown as string}
                  text
                  raised
                  icon={`${icon_classes} ${route_attributes[app_routes.user_profile$id].icon} `}
                  className="border-noround w-full h-full px-2 lobster_font text-xl shadow_on_hover"
                />
              </QueryLink>

             {/*  <div className="flex">
                <Button
                  //todo: projects quantity like "My projects (5)"
                  label="My stations"
                  text
                  raised
                  icon={`${icon_classes} pi-briefcase`}
                  className="border-noround w-full h-full px-2 lobster_font text-xl shadow_on_hover"
                />
                <Button
                  text
                  raised
                  //todo: switch to pi-chevron-up when opened projects list
                  icon={`pi pi-chevron-down`}
                  className="border-noround h-full px-2 shadow_on_hover"
                />
              </div> */}
            </>
            :
            <QueryLink to={app_routes.signin} onClick={() => actions.session.rightSidebarOpened(false)}>
              <Button
                label={route_attributes[app_routes.signin].name as unknown as string}
                text
                raised
                icon={`${icon_classes} ${route_attributes[app_routes.signin].icon}`}
                iconPos="right"
                className="border-noround w-full h-full px-2 text-primary shadow_on_hover lobster_font text-xl"
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
            className="border-noround w-full h-full px-2 text-primary"
          />
        </QueryLink> */}
        <div className="flex flex-column shadow-4">

        </div>



      </div>

      <div className="bottom flex flex-column">
        {
          signedin ?
            <Button
              label={<Translation capitalize field="logout" className="w-4" /> as unknown as string}
              text
              raised
              icon={`${icon_classes} pi-sign-out`}
              onClick={() => {
                logout();
                actions.session.rightSidebarOpened(false)
              }}
              iconPos="right"
              className="border-noround text-gray-800 text-left lobster_font text-xl shadow_on_hover"
            />
            : <></>
        }
      </div>

    </Sidebar>
  )
}