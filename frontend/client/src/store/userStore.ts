import { createStore } from 'zustand-x'

import {
  FrontUser,
} from '@/types'

const initialState = {
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
  admin: false,
  favorite_stations: [],
}


export const userStore = createStore('app')(initialState as unknown as (FrontUser & {
  subscription_plan: {
    name: string;
    ends: string;
  };
  admin: boolean;
}),
  {
    persist: {
      enabled: true,
      name: 'userStore'
    }
  })
  .extendSelectors((state, get, api) => ({
    favorite_station: (id?: string) => id && get.favorite_stations().includes(id),
  }))
  .extendActions((set, get, api) => ({
    reset: () => {
      Object.getOwnPropertyNames(set)
        .filter(n => ![
          'mergeState',
          'state'
        ].includes(n))
        //@ts-ignore
        .forEach(n => set[n](initialState[n]))
    },
  }))
  .extendActions((set, get, api) => ({
    update_user_data: (user: FrontUser) => {
      //@ts-ignore
      Object.keys(user).forEach(key => set[key](user[key]))
    },
    toggle_favorite_station: (id: string) => {
      const cur_stations = get.favorite_stations()

      set.favorite_stations(cur_stations.includes(id) ? cur_stations.filter(cur_id => cur_id != id) : [...cur_stations, id])
    },
  }))