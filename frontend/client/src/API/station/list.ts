import { objectToQuery } from "@/functions/objectToQuery"

import { Station } from "@/types"

export const list: (parameters?: {
  offset?: number,
  limit?: number,
}) => Promise<Station[]> = async (parameters) => {
  const resp = await fetch(`/api/v1/radio/list?${objectToQuery(parameters ?? {})}`)

  if (resp.status == 200) {
    const json = await resp.json()
    return json ?? []
  }

  return []
}