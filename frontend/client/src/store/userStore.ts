import { createStore } from '@udecode/zustood'

import {
  FrontUser,
} from '@/types'

export const userStore = createStore('app')({
  id: null,
  name: '',
  email: '',
  created: '',
  subscription_plan: {
    name: '',
    ends: ''
  },
  subscription_plan_loading: '',
} as unknown as (FrontUser & {
  subscriptionPlan: {
    subscription_plan: string;
    subscription_plan_ends: string;
  }
}),
  {
    persist: {
      enabled: true,
      name: 'userStore'
    }
  })