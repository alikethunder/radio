import {
  actions,
} from "@/store"

export const onLogout = () => {

  console.log('onLogout')

  actions.auth.signedin(false);

  //clear user info
  actions.user.reset()

}