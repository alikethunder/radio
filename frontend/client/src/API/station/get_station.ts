import { get_api_origin } from "@/functions"

import { Station } from "@/types"

export const get_station: (
  id: string,
) => Promise<Station> = async (id) => {
  const resp = await fetch(`${get_api_origin()}/api/v1/radio/${id}`)

  if (resp.status == 200) {
    const json = await resp.json()
    return json
  }

  return null
}