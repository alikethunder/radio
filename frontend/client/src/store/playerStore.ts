import { createStore } from 'zustand-x'

import {
  NumRange,
} from '@/types/generics/range'

const initialState = {
  volume: 100,
  prev_volume: 100,
}

type Player = {
  volume: NumRange<101>,
  prev_volume: NumRange<101>,
}

export const playerStore = createStore('app')(initialState,
  {
    persist: {
      enabled: true,
      name: 'playerStore'
    }
  })
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