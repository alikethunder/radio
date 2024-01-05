import { FC, useEffect } from "react"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import {
  logout,
} from '@/functions'
import { actions } from "@/store"

export const Navbar: FC = () => {

  return (
    <div className="flex flex-shrink-0 align-items-center shadow-2 h-3rem sm:h-4rem justify-content-between">
      <div className="left"></div>

      <div className="right h-full">
        <Button
          className="h-full border-noround border-none shadow-1 gray-800"
          text
          size="large"
          icon="pi pi-align-justify"
          onClick={() => actions.app.rightSidebarOpened(true)}
        />
      </div>
    </div>
  )
}