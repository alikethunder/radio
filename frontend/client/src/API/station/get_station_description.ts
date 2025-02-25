import { objectToQuery } from "@/functions/objectToQuery"

import { Station } from "@/types"

export const get_station_description: (
  id: string,
  language: string,
) => Promise<string> = async (id, language) => {
  const resp = await fetch(`${window.location.origin}/api/v1/radio/description/${id}/${language}`)

  if (resp.status == 200) {
    const text = await resp.text()

    return text
  }

  return ''
}