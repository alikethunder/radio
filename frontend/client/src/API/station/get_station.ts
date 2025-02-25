import { objectToQuery } from "@/functions/objectToQuery"

import { Station } from "@/types"

export const get_station: (
  id: string,
) => Promise<Station> = async (id) => {
  const resp = await fetch(`${window.location.origin}/api/v1/radio/${id}`)

  if (resp.status == 200) {
    const json = await resp.json()
    return json
  }

  return null
}