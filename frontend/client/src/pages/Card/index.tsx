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

import {
  CardDescriptionForm,
  CardForm,
} from '@/components'

import { CardPageParams } from "@/types/card"

export const Card = () => {

  const navigate = useNavigate()

  const { pageId, tab } = useLoaderData() as CardPageParams

  //console.log('[Card] pageId, tab : ', pageId, tab)

  const isDesktop = useMediaQuery({ query: '(min-width: 768.1px) and (min-height: 768.1px)' })

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
        pageId == 'create' ?
          isDesktop ?
            <div className="container">
              <CardForm />
              <CardDescriptionForm />
            </div>
            :
            tab == 'description' ?
              <CardDescriptionForm />
              :
              <CardForm />
          : ''
      }

    </div>
  )
}