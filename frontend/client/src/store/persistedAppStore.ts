import { createStore } from '@udecode/zustood'

export const persistedAppStore = createStore('app')({
  rememberme: false
},
  {
    persist: {
      enabled: true,
      name: 'persistedApp'
    }
  })