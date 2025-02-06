import { FC, memo, useCallback, useMemo, } from "react"

import { Button } from 'primereact/button'

import { Sidebar } from 'primereact/sidebar'

import { Dropdown } from 'primereact/dropdown'

import {
  QueryLink,
} from '@/components'

import {
  logout,
} from '@/functions'

import {
  app_routes,
  route_attributes,
} from '@/constants/router'

import {
  actions,
  useTrackedStore,
  useStore,
  store,
} from "@/store"

import './index.sass'
import { generatePath } from "react-router-dom"

import { icon_classes } from "@/constants/icon_classes"
import { classNames } from "primereact/utils"

import { useDebounceCallback } from "usehooks-ts"
import { useFavoriteStations, useTranslations, } from "@/hooks"
import languages_translations from '&/settings/languages_translations.json'

export const RightSidebar: FC = memo(() => {

  const rightSidebarOpened = useTrackedStore().session.rightSidebarOpened()

  const signedin = useStore().auth.signedin()

  const root_admin = useStore().user.admin()

  const language = useStore().translations.language()

  const languages = useStore().translations.languages()

  const favorite_stations = useFavoriteStations()

  const click_logout = useDebounceCallback(() => {
    logout()
    actions.session.rightSidebarOpened(false)
  }, 50)

  const update_sitemap = useDebounceCallback(async () => {
    const res = await fetch('/api/v1/settings/sitemap')

    console.log('[update_sitemap] result : ', res)
  }, 50)

  const languages_options = useMemo(() => languages.map(code => ({
    code,
    translation: languages_translations[code],
  })), [languages_translations])

  const active_dropdown_language = useMemo(() => languages_options.find(l => l.code == language), [language, languages_options])

  const close_rsb = useCallback(
    useDebounceCallback(() => actions.session.rightSidebarOpened(false), 50)
    , [])

  const change_jsons = useCallback(
    useDebounceCallback(
      async (e) => {
        if (e.target.files?.length) {
          console.log(e.target.files)

          const body = new FormData()

          for (const file of e.target.files) {
            if (file.name.includes('data')) {
              body.append('json_data', file)
            } else {
              body.append('json_info', file)
            }
          }

          fetch('/api/v1/radio/upload-jsons', {
            method: "POST",
            body,
          })
        }
      }
      , 50)
    , [])

  const remove_jsons = useCallback(
    useDebounceCallback(
      async (e) => {
        if (e.target.files?.length) {
          console.log(e.target.files)

          const body = new FormData()

          for (const file of e.target.files) {
            body.append('json', file)
          }

          fetch('/api/v1/radio/remove-jsons', {
            method: "POST",
            body,
          })
        }
      }
      , 50)
    , [])

  const [translations] = useTranslations([
    'logout',
    'feedback',
    'my_stations',
  ], true)

  const index_now = useDebounceCallback(async () => {

    await fetch('/api/v1/settings/indexnow')

  }, 100)

  const upload_genres = useCallback(useDebounceCallback(async (e) => {

    if (e.target.files?.length) {
      console.log(e.target.files)

      const body = new FormData()

      for (const file of e.target.files) {
        body.append('genres', file)
      }

      fetch('/api/v1/settings/genres', {
        method: "POST",
        body,
      })
    }
  }, 100), [])

  const upload_countries = useCallback(useDebounceCallback(async (e) => {

    if (e.target.files?.length) {
      console.log(e.target.files)

      const body = new FormData()

      for (const file of e.target.files) {
        body.append('countries', file)
      }

      fetch('/api/v1/settings/countries', {
        method: "POST",
        body,
      })
    }
  }, 100), [])

  const upload_languages = useCallback(useDebounceCallback(async (e) => {

    if (e.target.files?.length) {
      console.log(e.target.files)

      const body = new FormData()

      for (const file of e.target.files) {
        body.append('languages', file)
      }

      fetch('/api/v1/settings/languages', {
        method: "POST",
        body,
      })
    }
  }, 100), [])

  return (
    <Sidebar
      visible={rightSidebarOpened}
      position="right"
      onHide={() => actions.session.rightSidebarOpened(false)}
      className="w-15rem"
      showCloseIcon={false}
      pt={{
        root: {
          className: 'right_sidebar'
        },
        header: {
          style: {
            display: 'none'
          }
        },
        content: {
          className: 'flex flex-column justify-content-between p-0 pb-2'
        }
      }}
    >
      <div className="top flex flex-column flex-shrink-0">

        <Dropdown
          value={active_dropdown_language}
          onChange={(e) => actions.translations.language(e.value.code)}
          options={languages_options}
          optionLabel="translation"
          className="w-full border-noround border-none flex-shrink-0"
          checkmark
          pt={{
            list: {
              className: classNames({},
                'p-0',
              )
            }
          }}
        />

        {
          signedin ?
            <QueryLink to={generatePath(app_routes.user_profile$id, { id: store.user.id() })} onClick={close_rsb}>
              <Button
                label={route_attributes[app_routes.user_profile$id].name as unknown as string}
                text
                raised
                icon={`${icon_classes} ${route_attributes[app_routes.user_profile$id].icon} `}
                className="border-noround w-full px-2 action_text_font text-2xl shadow_on_hover"
              />
            </QueryLink>
            :
            <QueryLink to={app_routes.signin} onClick={close_rsb}>
              <Button
                label={route_attributes[app_routes.signin].name as unknown as string}
                text
                raised
                icon={`${icon_classes} ${route_attributes[app_routes.signin].icon}`}
                className="border-noround w-full px-2 text-primary shadow_on_hover action_text_font text-2xl"
              />
            </QueryLink>
        }

        {
          favorite_stations.length ?
            <QueryLink to={app_routes.my_stations} onClick={close_rsb}>
              <Button
                //todo: stations quantity as badge near icon"
                label={`${translations.my_stations} (${favorite_stations.length})`}
                text
                raised
                icon={`${icon_classes} ${route_attributes[app_routes.my_stations].icon}`}
                className="border-noround w-full px-2 text-2xl shadow_on_hover action_text_font"
              />
            </QueryLink>
            : <></>
        }

        {
          root_admin ?
            <Button
              label={'Update sitemap'}
              text
              raised
              icon={`${icon_classes} pi-sitemap`}
              className="border-noround w-full h-full px-2 text-2xl shadow_on_hover action_text_font"
              onClick={update_sitemap}
            />
            : <></>
        }
        {/* 
        {
          root_admin ?

            <Button
              label={'Upload stations json'}
              text
              raised
              icon={`${icon_classes} pi-file-plus`}
              className="border-noround w-full h-full px-2 text-2xl shadow_on_hover action_text_font z-0"
            >
              <label htmlFor="jsoninput" className="m-0 absolute top-0 bottom-0 left-0 right-0 z-1 cursor-pointer"
              ></label>
              <input
                type="file"
                id="jsoninput"
                name="jsoninput"
                accept="application/JSON"
                multiple
                className="hidden"
                onChange={change_jsons}
              />
            </Button>
            : <></>
        }
 */}
        {
          root_admin ?

            <Button
              label={'Remove stations json'}
              text
              raised
              icon={`${icon_classes} pi-file`}
              className="border-noround w-full h-full px-2 text-2xl shadow_on_hover action_text_font z-0"
            >
              <label htmlFor="jsoninput" className="m-0 absolute top-0 bottom-0 left-0 right-0 z-1 cursor-pointer"
              ></label>
              <input
                type="file"
                id="jsoninput"
                name="jsoninput"
                accept="application/JSON"
                className="hidden"
                onChange={remove_jsons}
              />
            </Button>
            : <></>
        }

        {
          root_admin ?
            <QueryLink to={generatePath(`${app_routes["station$id"]}/${'?edit'}`, { id: "new" })} onClick={close_rsb}>
              <Button
                label={'Create new station'}
                text
                raised
                icon={`${icon_classes} pi-plus-circle`}
                className="border-noround w-full px-2 text-2xl shadow_on_hover action_text_font"
              />
            </QueryLink>
            : <></>
        }
        {/* 
        {
          root_admin ?
            <Button
              label={'Index Now'}
              text
              raised
              icon={`${icon_classes} pi-info-circle`}
              className="border-noround w-full px-2 text-2xl shadow_on_hover action_text_font flex-shrink-0"
              onClick={index_now}
            />
            : <></>
        }
 */}
        {/* {
          root_admin ?
            <Button
              label={'Upload genres'}
              text
              raised
              icon={`${icon_classes} pi-file-plus`}
              className="border-noround w-full h-full px-2 text-2xl shadow_on_hover action_text_font z-0"
            >
              <label htmlFor="genresinput" className="m-0 absolute top-0 bottom-0 left-0 right-0 z-1 cursor-pointer"
              ></label>
              <input
                type="file"
                id="genresinput"
                name="genresinput"
                accept="application/JSON"
                multiple
                className="hidden"
                onChange={upload_genres}
              />
            </Button>
            : <></>
        }

        {
          root_admin ?
            <Button
              label={'Upload countries'}
              text
              raised
              icon={`${icon_classes} pi-file-plus`}
              className="border-noround w-full h-full px-2 text-2xl shadow_on_hover action_text_font z-0"
            >
              <label htmlFor="countriesinput" className="m-0 absolute top-0 bottom-0 left-0 right-0 z-1 cursor-pointer"
              ></label>
              <input
                type="file"
                id="countriesinput"
                name="countriesinput"
                accept="application/JSON"
                multiple
                className="hidden"
                onChange={upload_countries}
              />
            </Button>
            : <></>
        }

        {
          root_admin ?
            <Button
              label={'Upload languages'}
              text
              raised
              icon={`${icon_classes} pi-file-plus`}
              className="border-noround w-full h-full px-2 text-2xl shadow_on_hover action_text_font z-0"
            >
              <label htmlFor="languagesinput" className="m-0 absolute top-0 bottom-0 left-0 right-0 z-1 cursor-pointer"
              ></label>
              <input
                type="file"
                id="languagesinput"
                name="languagesinput"
                accept="application/JSON"
                multiple
                className="hidden"
                onChange={upload_languages}
              />
            </Button>
            : <></>
        } */}

      </div>

      <div className="bottom flex flex-column flex-shrink-0">

        <a href={`https://t.me/radio${language}best`} target="_blank" className="w-full">
          <Button
            label={translations.feedback}
            text
            raised
            icon={`${icon_classes} pi-telegram`}
            className="border-noround action_text_font px-2 text-xl shadow_on_hover w-full"
          />
        </a>

        {
          signedin ?
            <Button
              label={translations.logout}
              text
              raised
              icon={`${icon_classes} pi-sign-out`}
              onClick={click_logout}
              className="border-noround text-color-secondary px-2 action_text_font text-2xl shadow_on_hover"
            />
            : <></>
        }
      </div>

    </Sidebar>
  )
})