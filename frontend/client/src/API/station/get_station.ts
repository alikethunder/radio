import { decrypt } from "@/functions"

import { Station } from "@/types"
import { decompressFromBase64 } from "lz-string"

export const get_station: (
  id: string,
) => Promise<Station> = async (id) => {
  const resp = await fetch(`${window.location.origin}/api/v1/radio/${id}`)

  if (resp.status == 200) {
    const text = await resp.text()
    const decomp = decompressFromBase64(text)

    const decr = decrypt(decomp)

    const r = decrypt(decompressFromBase64(text))
    return JSON.parse(r)
  }

  return null
}