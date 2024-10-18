import { FC, useEffect } from "react"

import {
  actions,
  useTrackedStore,
  store,
  useStore
} from "@/store"

import oauth from '&/settings/google_oauth.json'
import { appStore } from "@/store/appStore"

export const GoogleOAuth: FC<{ rememberme?: boolean }> = ({ rememberme }) => {

  const language = useStore().persistedApp.language()

  useEffect(() => {

    //console.log('oauth settings : ', oauth, window.google)
    //todo: add code to remove the old button and create new one each time
    try {
      window.google.accounts.id.initialize({
        client_id: oauth.web.client_id,
        itp_support: true,
        ux_mode: 'redirect',
        login_uri: `http://localhost:${import.meta.env.VITE_DEV_PORT}/api/v1/auth/google-callback`,
        allowed_parent_origin: `http://localhost:${import.meta.env.VITE_DEV_PORT}`,
        use_fedcm_for_prompt: true,
      })

      window.google.accounts.id.renderButton(
        document.getElementById("google_signin"),
        {
          locale: language,
          theme: "filled_blue",
          size: "large",
          //use 'state' to pass parameters within google-callback request
          state: JSON.stringify({
            redirect_to: store.session.prev_pathname(),
            rememberme,
          }),
          click_listener: () => actions.session.redirect_from_google(true)
        }
      )
    } catch (e) {
      console.log('google init error : ', e)
    }
  }, [rememberme, language])

  return (
    <div id="google_signin" className="mb-4 align-self-center" />
  )
}