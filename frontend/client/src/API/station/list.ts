import { objectToQuery } from "@/functions/objectToQuery"
import { decrypt } from "@/functions"

import { Station } from "@/types"

export const list: (parameters?: {
  from?: string,
  limit?: number,
}) => Promise<Station[]> = async (parameters) => {
  const resp = await fetch(`${window.location.origin}/api/v1/radio/list?${objectToQuery(parameters ?? {})}`)

  if ([200, 304].includes(resp.status)) {

    const text = await resp.text()

    const r = decrypt(text)
    return JSON.parse(r)
  }

  return []
}