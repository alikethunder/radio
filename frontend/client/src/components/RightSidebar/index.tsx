import { FC, } from "react"

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
import { useDebounceCallback } from "usehooks-ts"
import { useFavoriteStations } from "@/hooks"

export const RightSidebar: FC = () => {

  const rightSidebarOpened = useTrackedStore().session.rightSidebarOpened()

  const signedin = useStore().auth.signedin()

  const root_admin = useStore().user.admin()

  const language = useStore().translations.language()

  const languages = useStore().translations.languages()

  const favorite_stations = useFavoriteStations()

  const click_logout = useDebounceCallback(() => {
    logout()
    actions.session.rightSidebarOpened(false)
  }, 50)

  const update_sitemap = useDebounceCallback(async () => {
    const res = await fetch('/api/v1/settings/sitemap')

    console.log('[update_sitemap] result : ', res)
  }, 50)

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
          onChange={(e) => actions.translations.language(e.value)}
          options={languages}
          optionLabel="name"
          className="w-full border-noround border-none flex-shrink-0"
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
            <QueryLink to={generatePath(app_routes.user_profile$id, { id: store.user.id() })} onClick={() => actions.session.rightSidebarOpened(false)}>
              <Button
                label={route_attributes[app_routes.user_profile$id].name as unknown as string}
                text
                raised
                icon={`${icon_classes} ${route_attributes[app_routes.user_profile$id].icon} `}
                className="border-noround w-full h-full px-2 action_text_font text-2xl shadow_on_hover"
              />
            </QueryLink>
            :
            <QueryLink to={app_routes.signin} onClick={() => actions.session.rightSidebarOpened(false)}>
              <Button
                label={route_attributes[app_routes.signin].name as unknown as string}
                text
                raised
                icon={`${icon_classes} ${route_attributes[app_routes.signin].icon}`}
                iconPos="right"
                className="border-noround w-full h-full px-2 text-primary shadow_on_hover action_text_font text-2xl"
              />
            </QueryLink>
        }

        {
          favorite_stations.length ?
            <QueryLink to={app_routes.my_stations} onClick={() => actions.session.rightSidebarOpened(false)}>
              <Button
                //todo: stations quantity like "My stations (5)"
                label={route_attributes[app_routes.my_stations].name as unknown as string}
                text
                raised
                icon={`${icon_classes} ${route_attributes[app_routes.my_stations].icon}`}
                className="border-noround w-full h-full px-2 text-2xl shadow_on_hover action_text_font"
              />
            </QueryLink>
            : <></>
        }

        {
          root_admin ?
            <Button
              label={'Update sitemap'}
              text
              raised
              icon={`${icon_classes} pi-sitemap`}
              className="border-noround w-full h-full px-2 text-2xl shadow_on_hover action_text_font"
              onClick={update_sitemap}
            />
            : <></>
        }

      </div>

      <div className="bottom flex flex-column flex-shrink-0">
        {
          signedin ?
            <Button
              label={<Translation capitalize field="logout" className="w-4" /> as unknown as string}
              text
              raised
              icon={`${icon_classes} pi-sign-out`}
              onClick={click_logout}
              iconPos="right"
              className="border-noround text-gray-800 text-left action_text_font text-2xl shadow_on_hover"
            />
            : <></>
        }
      </div>

    </Sidebar>
  )
}