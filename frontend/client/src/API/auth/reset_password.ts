import { get_api_origin } from "@/functions"
import { store } from "@/store"

export const reset_password = async (email: string) => {
  return await fetch(`${get_api_origin()}/api/v1/auth/reset-password`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      language: store.translations.language(),
    }),
    headers: {
      'Content-Type': 'application/json'
    },
  })
}