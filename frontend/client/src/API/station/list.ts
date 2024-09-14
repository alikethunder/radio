import { objectToQuery } from "@/functions/objectToQuery"

export const list = async (parameters?: {
  offset?: number,
  limit?: number,
}) => {
  const resp = await fetch(`/api/v1/radio/list?${objectToQuery(parameters ?? {})}`)

  if (resp.status == 200) {
    const json = await resp.json()
    return json
  }

  return {}
}