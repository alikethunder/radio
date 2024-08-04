import { createStore } from 'zustand-x'

export const authStore = createStore('app')({
  signedin: false,
})