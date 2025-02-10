import { createStore } from 'zustand-x'

import {
  NumRange,
} from '@/types/generics/range'

import { Station } from '@/types'

type Player = {
  volume: NumRange<101>,
  prev_volume: NumRange<101>,
  current_station: Station | null,
  playing: boolean,
  minimized: boolean,
}

const initialState = {
  volume: 100,
  prev_volume: 100,
  current_station: null,
  playing: false,
  minimized: false,
}

export const playerStore = createStore('app')(initialState as Player,
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
    switch_playing() {
      const playing = get.playing()
      set.playing(!playing)
    },
    toggle_player_size() {
      set.minimized(!get.minimized())
    }
  }))