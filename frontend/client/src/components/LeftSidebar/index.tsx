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

export const LeftSidebar: FC = () => {

  const leftSidebarOpened = useTrackedStore().session.leftSidebarOpened()


  return (
    <Sidebar
      visible={leftSidebarOpened}
      position="left"
      onHide={() => actions.session.leftSidebarOpened(false)}
      className="w-15rem"
      showCloseIcon={false}
      pt={{
        root: {
          className: 'left_sidebar'
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
 



      </div>

      <div className="bottom flex flex-column">
        
      </div>

    </Sidebar>
  )
}