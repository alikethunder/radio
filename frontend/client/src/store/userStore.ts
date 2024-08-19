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
  .extendActions((set, get, api) => ({
    update_user_data: (user: FrontUser) => {
      //@ts-ignore
      Object.keys(user).forEach(key => set[key](user[key]))
    }
  }))