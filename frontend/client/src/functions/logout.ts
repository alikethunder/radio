import { onLogout } from "./"

export const logout = async () => {
  await fetch('/api/v1/auth/logout', {
    method: 'POST'
  })
  
  onLogout()
}