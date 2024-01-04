import { createStore } from '@udecode/zustood'

export const authStore = createStore('app')({
  signedin: false,
})