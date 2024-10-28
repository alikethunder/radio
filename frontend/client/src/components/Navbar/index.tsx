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
  actions,
  store,
  useStore,
} from "@/store"

import {
  usePageInList,
  useTranslations,
  useTranslationsSkeleton,
} from '@/hooks'

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
import { useDebounceCallback } from "usehooks-ts"
import { useSearchParams } from "react-router-dom"

import './index.sass'

export const Navbar: FC = () => {

  const current_page = useStore().app.current_page()

  const station_tags = useStore().app.station_tags().map(t => t.name)

  const search_station_tags = useStore().persistedApp.search_station_tags()

  const [tags_input_value, set_tags_input_value] = useState('')

  const [tag_input_ref, set_tag_input_ref] = useState<HTMLInputElement | null>(null)

  const overlay_panel = useRef<OverlayPanel | null>(null)

  const search_stations_text = useStore().persistedApp.search_stations_text()

  const search_panel_collapsed = useStore().persistedApp.search_panel_collapsed()

  const filtered_tags = useMemo(() => station_tags.filter(tag => tag.includes(tags_input_value) && !search_station_tags.includes(tag)), [tags_input_value, station_tags, search_station_tags])

  const search_button_badge_value = useMemo(() => search_station_tags.length, [search_station_tags,])

  const [show_stations_search] = usePageInList([app_routes.root, app_routes.station$id])

  const [searchParams, set_search] = useSearchParams()

  const [translations] = useTranslations([
    'open_search_stations_panel',
    'search_station_name_and_description',
    'search_stations_by_tags',
    'sitename',
  ], true)

  const translations_skl = useTranslationsSkeleton({
    "search_radiostations": ["w-7rem"],
    "radiostation": ['w-8rem'],
    "error_radiostation_name_empty": ["w-8rem"],
  }, true)

  const click_search_tag = useDebounceCallback(tag => {
    actions.persistedApp.add_tag_to_search(tag)
    set_tags_input_value('')

    overlay_panel.current?.hide()

    if (filtered_tags.length > 1) {
      //hide if it's the last tag and panel will be empty

      setTimeout(() => {

        tag_input_ref?.focus()
      }, 50);
    }
  }, 50)

  useEffect(() => {
    //add tags from url at starts
    const tags = searchParams.get('tags')?.split(',')
    if (tags?.length) {
      tags?.forEach(tag => { if (tag) actions.persistedApp.add_tag_to_search(tag) })
      actions.persistedApp.search_panel_collapsed(false)
      //@ts-ignore
      store.persistedApp.search_panel()?.expand()
    }
  }, [])

  useEffect(() => {
    set_search(s => {
      s.set('tags', search_station_tags.join(','))
      return s
    })
  }, [search_station_tags])

  return (
    <>
      <div className="flex flex-shrink-0 shadow-2 h-3rem sm:h-4rem justify-content-between bg-white border-bottom-1 border-solid border-100 border-top-none border-left-none border-right-none">

        <div className="left h-full flex gap-1 sm:gap-2">

          <QueryLink to={app_routes.root}
            onClick={() => actions.session.rightSidebarOpened(false)}>
            <Button
              text
              raised
              className="flex flex-row gap-1 border-noround w-full h-full md:px-2 px-1  lobster_font text-xl shadow_on_hover md:text-3xl bangers-font logo-glow"
              pt={{
                root: {
                  style: {
                    //'text-shadow': 'var(--blue-600) -0.3px 1.24px 0px, var(--blue-600) 0.5px 1.07px 1px, -1px 0px 4px #26ff00',
                  }
                }
              }}
            >
              <span style={{
              }}>
                Radio
              </span>
              <i className={`pi-wave-pulse ${icon_classes}`} style={{
                transform: 'skew(-3deg, -7deg)'
              }}></i>
              <span style={{
                transform: 'skew(18deg, -10deg) translateY(-1px)'
              }}>Best</span>
            </Button>
          </QueryLink>

          <div className="lobster_font align-self-center text-primary max-h-full text-overflow-ellipsis text_hidden_overflow line-clamp-2 select-none text-sm sm:text-base">
            {
              current_page?.icon ?
                <i className={`pi ${current_page?.icon} mr-2`}></i>
                : <></>
            }

            {
              current_page?.name ?? ''
            }
          </div>

          {
            show_stations_search ?
              <Button
                //icon={`pi pi-search-${search_panel_collapsed ? 'plus' : 'minus'}`}
                rounded
                outlined
                raised
                aria-label={translations.open_search_stations_panel}
                className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center`}
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
              : <></>
          }
          <FormActionsState />

        </div>

        <div className="right h-full mr-0 md:mr-2">
          <Button
            className="h-full shadow-none"
            severity="info"
            text
            icon="pi pi-bars text-2xl md:text-3xl"
            onClick={() => actions.session.rightSidebarOpened(true)} />
        </div>
      </div>

      <Panel
        ref={e => actions.persistedApp.search_panel(e)}
        toggleable

        collapsed={search_panel_collapsed}

        pt={{
          root: {
            className: classNames({
              'hidden': !show_stations_search,
            },
            )
          },
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
              'flex-wrap',
              'p-2',
              'gap-4',
              'justify-content-center',
              'align-items-end',
            )
          }
        }}
      >

        <div className="max-w-full w-20rem flex flex-column justify-content-center gap-1 align-self-stretch">
          <div className="font-semibold flex-shrink-0 text-xl sm:text-2xl mb-auto">
            {translations_skl.search_radiostations}
          </div>

          {/* text search */}
          <IconField className="w-full align-self-start">

            {
              search_stations_text ?
                <InputIcon className="pi pi-times cursor-pointer" onClick={() => actions.persistedApp.search_stations_text('')} />
                : <></>
            }

            <InputText
              placeholder={translations.search_station_name_and_description}
              className="w-full"
              value={search_stations_text}

              onChange={(e) => actions.persistedApp.search_stations_text(e.target.value)}
            />

          </IconField>

        </div>

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
              placeholder={translations.search_stations_by_tags}
              className="w-full"
              value={tags_input_value}
              disabled={!filtered_tags.length}
              ref={e => set_tag_input_ref(e)}

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
                  'mx-2',
                  'shadow-5',
                  'surface-hover',
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
                onClick={() => click_search_tag(tag)}
              />)
            }
          </OverlayPanel>

        </div>
      </Panel>
    </>
  )
}