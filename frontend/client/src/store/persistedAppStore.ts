import { createStore } from 'zustand-x'

export const persistedAppStore = createStore('app')({
  rememberme: false
},
  {
    persist: {
      enabled: true,
      name: 'persistedApp'
    }
  })