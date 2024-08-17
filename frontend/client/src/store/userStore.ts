import { createStore } from 'zustand-x'

import {
  FrontUser,
} from '@/types'

export const userStore = createStore('app')({
  id: null,
  name: '',
  email: '',
  photo: null,
  created: '',
  subscription_plan: {
    name: '',
    ends: ''
  },
  subscription_plan_loading: '',
} as unknown as (FrontUser & {
  subscription_plan: {
    name: string;
    ends: string;
  }
}),
  {
    persist: {
      enabled: true,
      name: 'userStore'
    }
  })