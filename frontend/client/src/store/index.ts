import { mapValuesKey } from 'zustand-x'

import { appStore } from './appStore'
import { authStore } from './authStore'
import { persistedAppStore } from './persistedAppStore'
import { userStore } from './userStore'
import { toastStore } from './toastStore'
import { playerStore } from './playerStore'
import { sessionStore } from './sessionStore'
import { translationsStore } from './translationsStore'

// Global store
export const rootStore = {
  app: appStore,
  auth: authStore,
  persistedApp: persistedAppStore,
  user: userStore,
  toast: toastStore,
  player: playerStore,
  session: sessionStore,
  translations: translationsStore,
  /*contextMenu: contextMenuStore,
  editor: editorStore,
  modal: modalStore,
  repo: repoStore,
  toolbar: toolbarStore, */
};

// Global hook selectors
export const useStore = () => mapValuesKey('use', rootStore);

// Global tracked hook selectors
export const useTrackedStore = () => mapValuesKey('useTracked', rootStore);

// Global getter selectors
export const store = mapValuesKey('get', rootStore);

// Global actions
export const actions = mapValuesKey('set', rootStore);

export type Stores = keyof typeof rootStore