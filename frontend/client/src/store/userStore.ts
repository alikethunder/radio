import { createStore } from '@udecode/zustood'

import {
  FrontUser,
} from '@/types'

export const userStore = createStore('app')({
  id: null,
  name: '',
  email: '',
  created: '',
  subscriptionPlan: {
    name: '',
    ends: ''
  },
  subscriptionPlanIsLoading: '',
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