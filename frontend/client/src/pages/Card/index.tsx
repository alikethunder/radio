import { FC, useEffect, useState } from "react"
import { json, useLoaderData, redirect, RouteObject } from "react-router-dom"

import { useMediaQuery } from 'react-responsive'

import { TabMenu } from 'primereact/tabmenu'

import './index.sass'

import { ReactComponent as cardIcon } from '@/assets/svg/vertical_card.svg'
console.log(cardIcon)

import { CardPageParams } from "@/types/card"

export const Card = () => {
  const { pageId, tab } = useLoaderData() as CardPageParams
  console.log('[Card] pageId, tab : ', pageId, tab)

  const isDesktop = useMediaQuery({ query: '(min-width: 575.9px) and (min-height: 575.9px)' })

  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      label: 'Card',
      icon: cardIcon
    },
    {
      label: 'Description',
      icon: 'pi pi-fw pi-align-left'
    }
  ]

  return (
    <div className="sm:py-5 py-4 sm:px-6 px-4 w-full h-full overflow-y-auto page card_page">

      <TabMenu model={tabs} activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)} />

      {
        isDesktop ? '' :
          <>
            {/* tabs */}
          </>
      }

      {/* tab main view content */}

      {/* tab description view content */}

      {
        pageId == 'create'
          ?
          <>

          </>
          :
          <></>
      }

      {/* this is pseudo markup to see the structure */}
      <div className="tabs"></div>

      <div className="form">

      </div>

      <div className="content">
        <div className="card">

        </div>
      </div>

    </div>
  )
}