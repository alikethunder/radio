import { createStore } from '@udecode/zustood'

import {
  FrontUser,
} from '@/types'

export const userStore = createStore('app')({
  id: null,
  name: '',
  email: '',
  created: '',
} as unknown as FrontUser,
  {
    persist: {
      enabled: true,
      name: 'userStore'
    }
  })