import { actions } from "@/store"
import { onLogout } from "./"

export const logout = async () => {
  await fetch(`${window.location.origin}/api/v1/auth/logout`, {
    method: 'POST'
  })

  actions.persistedApp.favorite_stations([])

  onLogout()
}