import {
  actions,
  store,
} from "@/store"

import { navigateFromProtectedRoute } from '@/functions'

export const onLogout = () => {

  actions.auth.signedin(false);

  //clear user info
  //@ts-ignore
  (['id', 'name', 'email', 'created'] as (keyof FrontUser)[]).forEach(i => actions.user[i](i === 'id' ? null : ''))

  navigateFromProtectedRoute()
}