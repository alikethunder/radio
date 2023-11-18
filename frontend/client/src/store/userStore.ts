import { createStore } from '@udecode/zustood'

import {
  FrontUser,
} from '../../types'

export const userStore = createStore('app')({
  id: null,
  name: '',
  email: '',
  created: '',
  updated: '',
} as unknown as FrontUser,
  {
    persist: {
      enabled: true,
      name: 'userStore'
    }
  })