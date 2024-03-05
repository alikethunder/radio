import { mapValuesKey } from '@udecode/zustood'

import { appStore } from './appStore'
import { authStore } from './authStore'
import { persistedAppStore } from './persistedAppStore'
import {userStore} from './userStore'
import { toastStore } from './toastStore'

// Global store
export const rootStore = {
  app: appStore,
  auth: authStore,
  persistedApp: persistedAppStore,
  user: userStore,
  toast: toastStore,
  /* combobox: comboboxStore,
  contextMenu: contextMenuStore,
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