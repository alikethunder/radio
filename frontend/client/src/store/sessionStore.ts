import { createStore } from 'zustand-x'

import {
  app_routes,
} from '@/constants/router'

import { createJSONStorage } from 'zustand/middleware'

type SessionStore = {
  rightSidebarOpened: boolean;
  leftSidebarOpened: boolean;
  prev_pathname: string;
  redirect_from_google: boolean;
}

const initial_state = {
  rightSidebarOpened: false,
  leftSidebarOpened: false,
  prev_pathname: app_routes.root,
  redirect_from_google: false,
} as SessionStore

export const sessionStore = createStore('sessionStore')(initial_state, {
  persist: {
    enabled: true,
    name: 'appStore',
    storage: createJSONStorage(() => sessionStorage),
  }
})