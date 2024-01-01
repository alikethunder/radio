import { FC, useEffect, useState } from "react"

import {
  json,
  useLoaderData,
  redirect,
  RouteObject,
  useNavigate,
} from "react-router-dom"

import { useMediaQuery } from 'react-responsive'

import { TabMenu } from 'primereact/tabmenu'
import { TabView, TabPanel } from 'primereact/tabview'

import './index.sass'

import { ReactComponent as cardIcon } from '@/assets/svg/vertical_card.svg'
console.log(cardIcon)

import { CardPageParams } from "@/types/card"

export const Card = () => {

  const navigate = useNavigate()

  const { pageId, tab } = useLoaderData() as CardPageParams
  console.log('[Card] pageId, tab : ', pageId, tab)

  const isDesktop = useMediaQuery({ query: '(min-width: 575.9px) and (min-height: 575.9px)' })

  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    setActiveTab(Number(tab == 'description'))
  }, [tab])

  useEffect(() => {
    navigate(`/card/create/${activeTab ? 'description' : ''}`)
  }, [activeTab])

  return (
    <div className="md:py-4 py-0 sm:px-4 px-2 w-full h-full overflow-y-auto page card_page">

      <TabView
        activeIndex={activeTab}
        onTabChange={(e) => {
          setActiveTab(e.index)
        }}
        pt={{
          root: {
            style: {
              //position: 'relative'
            }
          },
          inkbar: {
            style: {
              display: 'block',
              position: 'absolute',
              bottom: 0,
              height: '2px',
              transition: '500ms cubic-bezier(0.35, 0, 0.25, 1)',
              backgroundColor: 'var(--primary-color)'
            }
          }
        }}>
        <TabPanel
          header="Card"
          leftIcon={cardIcon}
          className='main_tab'
        >
        </TabPanel>
        <TabPanel
          header="Description"
          leftIcon='pi pi-fw pi-align-left'
        >
        </TabPanel>
      </TabView>


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