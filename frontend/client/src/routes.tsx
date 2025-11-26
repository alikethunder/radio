import React, { Profiler } from "react"
import { redirect, RouteObject, ShouldRevalidateFunctionArgs, } from "react-router-dom"
import App from "@/App"

import {
  Signin,
  Signup,
  Verification,
  ResetPassword,
} from "@/pages/auth"

import {
  Home,
  PurchasePlan,
  UserProfile,
  Station,
  FavoriteStations,
  Shared,
  History,
} from '@/pages'

import {
  actions,
  store
} from '@/store'

import {
  app_routes,
} from '@/constants/router'

import {
  list as stations_list,
} from '@/API/station/list'

import {
  get_station,
} from '@/API/station/get_station'
import { useFavoriteStations } from "./hooks"
import { get_api_origin, is_ssr } from "./functions"
import { Language, StationCountry, StationGenre, StationLanguage } from "./types"
import { get_station_description } from "./API/station/get_station_description"

type Loader_params = { params: { [param: string]: string; }, request: Request }

const auth_loader = () => {
  return {
    loader: ({
      params,
      request,
    }: Loader_params) => {
      //console.log('[auth_loader] params, request : ', params, request,)
      if (store.auth.signedin()) {
        //console.log('[auth_loader] redirect')
        return redirect(app_routes.root + new URL(request.url).search)
      }
      return null
    }
  }
}

let signedin = false

const get_alphabet_sort = (language: Language | null) => ((a: StationLanguage | StationCountry | StationGenre, b: StationLanguage | StationCountry | StationGenre) => {
  language ??= 'en'
  return (a[language] ?? '') > (b[language] ?? '') ? 1 : -1
})

globalThis.translations = globalThis.translations || {}

export const routes = [
  {
    path: app_routes.root,
    element: <Profiler id="App" onRender={(id, phase) => {
      console.log('App render, id , phase : ', id, phase)
    }}><App /></Profiler>,
    loader: async ({ request }) => {
      //language preset
      const resp = await fetch(`${get_api_origin()}/api/v1/translation`)

      const url = new URL(request.url)

      const url_language = url.searchParams.get('language') as Language

      if (resp.status == 200) {
        const languages = await resp.json()

        actions.translations.set_languages(languages)
      }

      const language = is_ssr() ? url_language : store.translations.language()

      //console.log('language : ', language)

      const alphabet_sort = get_alphabet_sort(language)

      actions.app.current_page({})
      const tags_resp = await fetch(`${get_api_origin()}/api/v1/tags/`)
      const tags = await tags_resp.json()
      actions.session.station_tags(tags ?? [])

      const genres_resp = await fetch(`${get_api_origin()}/api/v1/settings/genres/${language ?? 'en'}`)
      const genres = await genres_resp.json() as StationGenre[]
      actions.session.station_genres((genres ?? []).sort(alphabet_sort))

      const countries_resp = await fetch(`${get_api_origin()}/api/v1/settings/countries/${language ?? 'en'}`)
      const countries = await countries_resp.json() as StationCountry[]
      actions.session.station_countries((countries ?? []).sort(alphabet_sort))

      const languages_resp = await fetch(`${get_api_origin()}/api/v1/settings/languages/${language ?? 'en'}`)
      const languages = await languages_resp.json() as StationLanguage[]
      actions.session.station_languages((languages ?? []).sort(alphabet_sort))

      fetch(`${get_api_origin()}/api/v1/translation/${language}/?fields=${['genre', 'language', 'tags'].join(',')}`).then(r => r.json()).then(json => {

        //console.log('[useTranslations] response : ', json)

        Object.entries(json).map(([field, text]) => {
          globalThis.translations[field] = text.charAt(0).toUpperCase() + text.slice(1)
        })
      })

      return null
    },
    shouldRevalidate: () => {
      return false
    },
    children: [

      {
        path: app_routes.root,
        element: <Home />,
        loader: async ({ request }) => {
          const url = new URL(request.url)

          const language = url.searchParams.get('language') as Language

          const resp = await fetch(`${get_api_origin()}/api/v1/translation/${language}/home_page_content`)
          const text = await resp.text()
          return text
        },
        shouldRevalidate: () => false,
      },

      {
        path: app_routes.shared,
        element: <Shared />,
        loader: async (
          {
            params,
          }: Loader_params
        ) => {
          const { ids } = params
          if (ids) {
            return ids
          } else {
            return redirect('/')
          }

        },
        shouldRevalidate: () => false,
      },

      {
        path: app_routes.history,
        element: <History />,
        shouldRevalidate: () => false,
      },

      {
        path: app_routes.purchase_plan,
        element: <PurchasePlan />
      },

      {
        path: app_routes.user_profile$id,
        element: <UserProfile />,
        loader(
          {
            params,
            request,
          }: Loader_params
        ) {
          //console.log('user_profile params : ', params, request)

          //own user profile
          if (params.id == store.user.id()) {
            return {
              id: params.id,
              name: store.user.name(),
              email: store.user.email(),
            }
          } else {
            //todo: load public user data from db

          }

          //if there is no such project
          return null
        },
      },

      {
        path: app_routes.station$id,
        element: <Station />,
        loader: async (
          {
            params,
            request,
          }: Loader_params
        ) => {
          console.log('station params : ', params)

          const { id } = params

          if (id == 'new') {
            //new station

            const is_admin = store.user.admin()
            //console.log('[loader Station] root admin : ', is_admin)
            if (!is_admin) {
              return redirect('/')
            }

            return {
              id,
            }
          }
          try {
            const url = new URL(request.url)

            const url_language = url.searchParams.get('language') as Language
            const language = is_ssr() ? url_language : store.translations.language() as Language

            const [station, description] = await Promise.all([
              get_station(id),
              get_station_description(id, language)
            ])

            station[`description_${language}`] = description

            if (!station) {
              throw new Error('station not found')
            }

            actions.app.current_page({
              name: station?.name
            })

            return station
          } catch (e) {
            console.log(`[router ${request.url}] error : `, e)

            //if there is no such station
            return redirect(app_routes.root)
          }

        },
        shouldRevalidate: ({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) => currentUrl.pathname !== nextUrl.pathname,
      },

      {
        path: app_routes.my_stations,
        element: <FavoriteStations />,
        loader: async (
          {
            params,
            request,
          }: Loader_params
        ) => {
          return null
        },
        shouldRevalidate: () => false,
      },

      {
        path: app_routes.signin,
        ...auth_loader(),
        element: <Signin />,
        /* shouldRevalidate: (data) => {
          console.log('[Signin] shouldRevalidate data : ', store.auth.signedin(), data)
          if (signedin == store.auth.signedin()) {
            return false
          } else {
            signedin = store.auth.signedin()
            return true
          }
        }, */
      },
      {
        path: app_routes.signup,
        ...auth_loader(),
        element: <Signup />,
      },
      {
        path: app_routes.verification,
        ...auth_loader(),
        element: <Verification />,
      },
      {
        path: app_routes.reset_password,
        ...auth_loader(),
        element: <ResetPassword />,
      }
    ],
  },
] as RouteObject[]