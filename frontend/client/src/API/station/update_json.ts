import { get_api_origin } from "@/functions"

export const update = async (id: string, body: { [x: string]: any }) => {
  const resp = await fetch(`${get_api_origin()}/api/v1/radio/update/${id}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return resp
}