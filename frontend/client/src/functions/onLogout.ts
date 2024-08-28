import {
  actions,
} from "@/store"

export const onLogout = () => {

  console.log('onLogout')

  actions.auth.signedin(false);

  //clear user info
  //@ts-ignore
  (['id', 'name', 'email', 'created', 'photo'] as (keyof FrontUser)[]).forEach(i => actions.user[i](i === 'id' ? null : ''))

}