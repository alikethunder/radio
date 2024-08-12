import { FC, useEffect } from "react"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import {
  logout,
} from '@/functions'

import { actions, useStore } from "@/store"

import { usePageInList } from '@/hooks'

import {
  app_routes,
  auth_routes,
} from '@/constants/router'

export const Navbar: FC = () => {

  const [authPage, checked_auth_page] = usePageInList(auth_routes)

  const current_page_name = useStore().app.current_page_name()

  return (
    <div className="flex flex-shrink-0  shadow-2 h-3rem sm:h-4rem justify-content-between bg-white">
      
      <div className="left h-full flex ">
        
        <div className="current_page_name align-self-center font-italic font-medium ml-3 md:ml-5 text-lg md:text-xl">
          {
            current_page_name ?? ''
          }
        </div>

      </div>

      <div className="right h-full mr-0 md:mr-2">
        {
          checked_auth_page && authPage ? <></> :
            <Button
              className="h-full shadow-none"
              severity="info"
              text
              icon="pi pi-bars text-2xl md:text-3xl"
              onClick={() => actions.app.rightSidebarOpened(true)} />
        }
      </div>
    </div>
  )
}