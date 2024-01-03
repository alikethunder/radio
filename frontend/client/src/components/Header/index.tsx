import { FC, useEffect } from "react"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import {
  logout,
} from '@/functions'

export const Header: FC = () => {


  return (
    <div className="flex flex-shrink-0 align-items-center shadow-2 h-3rem sm:h-4rem justify-content-between">
      <div className="left"></div>

      <div className="right h-full">
        <Button label="Logout" severity="secondary" className="h-full" text icon="pi pi-sign-out" onClick={logout}/>
      </div>
    </div>
  )
}