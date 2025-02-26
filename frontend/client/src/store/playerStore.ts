import { createStore } from 'zustand-x'

import {
  NumRange,
} from '@/types/generics/range'

import {
  Station,
  HistoryRecord,
} from '@/types'

type Player = {
  volume: NumRange<101>,
  prev_volume: NumRange<101>,
  current_station: Station | null,
  playing: boolean,
  minimized: boolean,
  history: HistoryRecord[],
  current_history_station_id: string | null,
}

const initialState = {
  volume: 100,
  prev_volume: 100,
  current_station: null,
  playing: false,
  minimized: false,
  history: [],
  current_history_station_id: null,
}

export const playerStore = createStore('app')(initialState as Player,
  {
    persist: {
      enabled: true,
      name: 'playerStore'
    }
  })
  .extendSelectors((state, get, api) => ({
    history_get_from_last(n: number) {
      const last = get.history().length - 1
      return get.history()[last - n]
    }
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
    switch_playing() {
      const playing = get.playing()
      set.playing(!playing)
    },
    toggle_player_size() {
      set.minimized(!get.minimized())
    },
    history_add(record: HistoryRecord) {
      set.history([
        ...get.history(),
        record,
      ].slice(-100))
    },
    delete_history_record(record_id: string) {
      set.history(get.history().filter(r => r.id !== record_id))
    },
    delete_history() {
      set.history([])
    },
  }))