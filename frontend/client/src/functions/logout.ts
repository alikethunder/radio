import { onLogout } from "./"

export const logout = async () => {
  await fetch('/auth/logout', {
    method: 'GET'
  })
  
  onLogout()
}