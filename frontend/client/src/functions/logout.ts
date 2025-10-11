import { actions } from "@/store"
import { get_api_origin, onLogout } from "@/functions"

export const logout = async () => {
  await fetch(`${get_api_origin()}/api/v1/auth/logout`, {
    method: 'POST'
  })

  actions.persistedApp.favorite_stations([])

  onLogout()
}