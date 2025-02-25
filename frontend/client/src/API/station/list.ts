import { objectToQuery } from "@/functions/objectToQuery"

import { Station } from "@/types"

export const list: (parameters?: {
  from?: string,
  limit?: number,
  admin?: boolean,
}) => Promise<Station[]> = async (parameters) => {
  const resp = await fetch(`${window.location.origin}/api/v1/radio/list?${objectToQuery(parameters ?? {})}`)

  if ([200, 304].includes(resp.status)) {
    const json = await resp.json()
    return json ?? []
  }

  return []
}