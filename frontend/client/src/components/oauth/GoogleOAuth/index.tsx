import { FC, useEffect} from "react"

import oauth from '../../../../settings/google_oauth.json'

export const GoogleOAuth: FC<{rememberme?: boolean}> = ({rememberme}) => {

  useEffect(()=>{

    //console.log('oauth settings : ', oauth)

    window.google.accounts.id.initialize({
      client_id: oauth.web.client_id,
      itp_support: true,
      ux_mode: 'redirect',
      login_uri: `${window.location.origin}/auth/google-callback${rememberme ? '?rememberme' : ''}`,
      allowed_parent_origin: window.location.origin,
    })

    window.google.accounts.id.renderButton(
      document.getElementById("google_signin"),
      {
        locale: 'ru',
        theme: "filled_blue",
        size: "large",
      }
    )
  },[])

  return (
    <div id="google_signin" className="mb-4 align-self-center" />
  )
}