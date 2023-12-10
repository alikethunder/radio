import {
  createBrowserRouter,
} from "react-router-dom"

import {
  actions,
  store,
} from "@/store"

export const onLogout = ()=>{

  const { navigate, state: {location: {pathname}} } = store.app.router() as ReturnType<typeof createBrowserRouter>

  actions.auth.signedin(false);

  //@ts-ignore
  (['id', 'name', 'email', 'created'] as (keyof FrontUser)[]).forEach(i => actions.user[i](i === 'id' ? null : ''))

  //redirect to signin if failed
  if (![
    '/signup',
    '/signin',
    '/reset-password',
    '/verification'
  ].find(path => pathname.includes(path))) {
    navigate('/signin')
  }
}