import { store } from "@/store"

export const hide_multiselects = () => {
  ['genres', 'countries', 'languages'].forEach(key => {
    //@ts-ignore
    store.app[key + '_multiselect_ref']().hide()
  })
}