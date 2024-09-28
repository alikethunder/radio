import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Button } from 'primereact/button'

import { Panel } from 'primereact/panel'

import { InputText } from "primereact/inputtext"

import { OverlayPanel } from 'primereact/overlaypanel'

import { IconField } from "primereact/iconfield"

import { InputIcon } from "primereact/inputicon"

import { classNames } from 'primereact/utils'

import {
  logout,
} from '@/functions'

import { actions, store, useStore } from "@/store"

import { usePageInList } from '@/hooks'

import {
  app_routes,
  auth_routes,
  route_attributes,
} from '@/constants/router'

import {
  FormActionsState,
  QueryLink,
  StationTag,
} from '@/components'

import { icon_classes } from "@/constants/icon_classes"

export const Navbar: FC = () => {

  const current_page = useStore().app.current_page()

  const station_tags = useStore().app.station_tags().map(t => t.name)

  const search_station_tags = useStore().app.search_station_tags()

  const [tags_input_value, set_tags_input_value] = useState('')

  const overlay_panel = useRef<OverlayPanel | null>(null)

  const filtered_tags = useMemo(() => station_tags.filter(tag => tag.includes(tags_input_value) && !search_station_tags.includes(tag)), [tags_input_value, station_tags, search_station_tags])

  const add_tag_to_search = useCallback((tag: string) => {
    actions.app.search_station_tags([...store.app.search_station_tags(), tag])
  }, [])

  //console.log('navbar_actions : ', navbar_actions)

  return (
    <>
      <div className="flex flex-shrink-0  shadow-2 h-3rem sm:h-4rem justify-content-between bg-white border-bottom-1 border-solid border-100">

        <div className="left h-full flex ">

          <QueryLink to={app_routes.root}
            onClick={() => actions.app.rightSidebarOpened(false)}>
            <Button
              label={`Radio`}
              text
              raised
              icon={`${icon_classes} pi-wave-pulse`}
              className="border-noround w-full h-full md:px-3 px-2 text-secondary lobster_font text-xl shadow_on_hover text-xl md:text-2xl"
            />
          </QueryLink>

          <div className="lobster_font align-self-center ml-2 md:ml-3 flex align-items-center text-secondary">
            {
              current_page?.icon ?
                <i className={`${icon_classes} ${current_page?.icon} mr-2`}></i>
                : <></>
            }

            {
              current_page?.name ?? ''
            }
          </div>

          <Button
            icon="pi pi-search"
            rounded
            outlined
            raised
            aria-label="Search stations"
            className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center`}
            severity={`info`}

            onClick={(e) => {
              store.app.search_panel()?.toggle(e)
            }}
          />

          <FormActionsState />

        </div>

        <div className="right h-full mr-0 md:mr-2">
          <Button
            className="h-full shadow-none"
            severity="info"
            text
            icon="pi pi-bars text-2xl md:text-3xl"
            onClick={() => actions.app.rightSidebarOpened(true)} />
        </div>
      </div>

      <Panel
        ref={e => actions.app.search_panel(e)}
        toggleable
        pt={{
          header: {
            style: {
              display: 'none'
            }
          },
          toggleableContent: {
            //panel content
          }
        }}
      >

        {/* text search */}

        {/* tags search */}
        <div className="flex flex-column ">

          <div className="flex gap-2">
            {/* searched tags */}

            {
              search_station_tags?.map(tag => <StationTag tag={tag} />)
            }
          </div>

          <IconField className="w-13rem">

            {
              tags_input_value ?
                <InputIcon className="pi pi-times cursor-pointer" onClick={() => set_tags_input_value('')} />
                : <></>
            }

            <InputText
              value={tags_input_value}
              onChange={(e) => set_tags_input_value(e.target.value)}
              onFocus={(e) => overlay_panel.current?.show(e, e.target)}
              onKeyUp={(e) => {
                const exact = filtered_tags.find(t => t === (e.target as HTMLInputElement).value)

                if (
                  e.code == 'Enter'
                  || e.key == 'Enter'
                ) {
                  if (filtered_tags.length == 1) {

                    add_tag_to_search(filtered_tags[0])
                    set_tags_input_value('')

                  } else if (exact) {

                    add_tag_to_search(exact)
                    set_tags_input_value('')
                  }
                }
              }}
            />

          </IconField>

          <OverlayPanel
            ref={overlay_panel}
            pt={{
              root: {
                className: classNames({

                },
                  'max-w-25rem',
                  'w-11',
                  'mx-3',
                )
              }
            }}
          >
            <div className="flex flex-wrap gap-2">
              {
                filtered_tags?.map(tag => <StationTag tag={tag} onClick={() => {
                  console.log('click tag: ', tag)
                  add_tag_to_search(tag)
                  set_tags_input_value('')
                }} />)
              }
            </div>
          </OverlayPanel>

        </div>


        {/*  <Chips
          value={search_station_tags}
          onChange={e => actions.app.search_station_tags(e.value ?? [])}
          allowDuplicate={false}

          pt={{
            token: {
              className: classNames({

              },
                'p-0',
                'bg-primary',
                'ml-1'
              ),
            },
            removeTokenIcon: {
              className: classNames({},
                'ml-0',
                'mr-1'
              )
            }
          }}

          itemTemplate={tag => <StationTag tag={tag} />}
        /> */}

      </Panel>
    </>
  )
}