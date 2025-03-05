import { decrypt } from "@/functions"

import { Station } from "@/types"

export const get_station: (
  id: string,
) => Promise<Station> = async (id) => {
  const resp = await fetch(`${window.location.origin}/api/v1/radio/${id}`)

  if (resp.status == 200) {
    const text = await resp.text()

    const r = decrypt(text)
    return JSON.parse(r)
  }

  return null
}