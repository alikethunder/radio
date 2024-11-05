import { FC, useEffect } from "react"

import {
  actions,
  store,
  useStore
} from "@/store"

import oauth_dev from '&/settings/google_oauth_dev.json'
import oauth_prod from '&/settings/google_oauth_prod.json'

export const GoogleOAuth: FC<{ rememberme?: boolean }> = ({ rememberme }) => {

  const language = useStore().translations.language()

  useEffect(() => {
    try {
      window.google.accounts.id.initialize({
        client_id: (window.location.port == '3000' ? oauth_dev : oauth_prod).web.client_id,
        itp_support: true,
        ux_mode: 'redirect',
        login_uri: `${window.location.origin}/api/v1/auth/google-callback`,
        allowed_parent_origin: `${window.location.origin}`,
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