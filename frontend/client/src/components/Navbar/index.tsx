import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Button } from 'primereact/button'

import { Panel } from 'primereact/panel'

import { InputText } from "primereact/inputtext"

import { OverlayPanel } from 'primereact/overlaypanel'

import { IconField } from "primereact/iconfield"

import { InputIcon } from "primereact/inputicon"

import { classNames } from 'primereact/utils'

import { Badge } from 'primereact/badge'

import { StationTagRemoveTokenIcon } from "@/layout parts"

import {
  logout,
} from '@/functions'

import {
  actions,
  store,
  useStore,
} from "@/store"

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

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const [tags_input_value, set_tags_input_value] = useState('')

  const overlay_panel = useRef<OverlayPanel | null>(null)

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const search_panel_collapsed = useStore().persistedApp.search_panel_collapsed()

  const filtered_tags = useMemo(() => station_tags.filter(tag => tag.includes(tags_input_value) && !search_station_tags.includes(tag)), [tags_input_value, station_tags, search_station_tags])

  const search_button_badge_value = useMemo(() => search_station_tags.length, [search_station_tags,])

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
            //icon={`pi pi-search-${search_panel_collapsed ? 'plus' : 'minus'}`}
            rounded
            outlined
            raised
            aria-label="Open search stations panel"
            className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex justify-content-center align-items-center`}
            severity={`info`}

            onClick={(e) => {
              store.persistedApp.search_panel()?.toggle(e)
              actions.persistedApp.search_panel_collapsed(!store.persistedApp.search_panel_collapsed())
            }}
          >
            <i className={`pi pi-search-${search_panel_collapsed ? 'plus' : 'minus'} p-overlay-badge`}>
              <Badge
                value={search_button_badge_value}
                severity="warning"
                style={{
                  fontSize: '0.6rem',
                  lineHeight: '.7rem',
                  height: '0.8rem',
                  width: '.8rem',
                  minWidth: '.8rem',
                  right: '.1rem',
                  top: '.1rem',
                  ...search_button_badge_value ? {} : {
                    display: 'none'
                  },
                }}
                className="p-0"
              />
            </i>

          </Button>

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
        ref={e => actions.persistedApp.search_panel(e)}
        toggleable

        collapsed={search_panel_collapsed}

        pt={{
          header: {
            style: {
              display: 'none'
            }
          },
          toggleableContent: {
            //panel content
            className: classNames({},
              'shadow-2',
            )
          },
          content: {
            //panel content
            className: classNames({},
              'flex',
              'flex-row',
              'flex-wrap-reverse',
              'justify-content-center',
              'p-2',
              'gap-4',
            )
          }
        }}
      >

        {/* text search */}
        <IconField className="max-w-full w-20rem align-self-start">

          {
            search_stations_text ?
              <InputIcon className="pi pi-times cursor-pointer" onClick={() => actions.persistedApp.search_stations_text('')} />
              : <></>
          }

          <InputText
            placeholder="Search station name and description"
            className="w-full"
            value={search_stations_text}

            onChange={(e) => actions.persistedApp.search_stations_text(e.target.value)}
          />

        </IconField>

        {/* tags search */}
        <div className="flex flex-column gap-2 max-w-full w-20rem">

          <div className="flex flex-row flex-wrap gap-2 align-items-start">
            {/* searched tags */}

            {
              search_station_tags?.map(tag =>
                <div className="flex bg-red-600 border-round align-items-center hover:overflow-hidden">
                  <StationTag tag={tag} disable_link />

                  <StationTagRemoveTokenIcon
                    onClick={() => {
                      actions.persistedApp.search_station_tags(store.persistedApp.search_station_tags().filter(t => t != tag))
                    }} />
                </div>
              )
            }
          </div>

          <IconField className="">

            {
              tags_input_value ?
                <InputIcon className="pi pi-times cursor-pointer" onClick={() => set_tags_input_value('')} />
                : <></>
            }

            <InputText
              placeholder="Search station tags"
              className="w-full"
              value={tags_input_value}
              disabled={!filtered_tags.length}

              onChange={(e) => set_tags_input_value(e.target.value)}

              onFocus={(e) => {
                overlay_panel.current?.show(e, e.target)
              }}

              onKeyUp={(e) => {
                const exact = filtered_tags.find(t => t === (e.target as HTMLInputElement).value)

                if (
                  e.code == 'Enter'
                  || e.key == 'Enter'
                ) {
                  if (filtered_tags.length == 1) {

                    actions.persistedApp.add_tag_to_search(filtered_tags[0])
                    set_tags_input_value('')

                  } else if (exact) {

                    actions.persistedApp.add_tag_to_search(exact)
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
              },
              content: {
                className: classNames({},
                  "flex flex-wrap gap-2 p-2",
                )
              }
            }}
          >
            {
              filtered_tags?.map(tag => <StationTag
                tag={tag}
                onClick={() => {
                  actions.persistedApp.add_tag_to_search(tag)
                  set_tags_input_value('')

                  if (filtered_tags.length == 1) {
                    //hide if it's the last tag and panel will be empty
                    overlay_panel.current?.hide()
                  }
                }}
              />)
            }
          </OverlayPanel>

        </div>

      </Panel>
    </>
  )
}