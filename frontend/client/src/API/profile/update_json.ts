import { get_api_origin } from "@/functions"

export const update_json = async (body: { [x: string]: any }) => {
  const resp = await fetch(`${get_api_origin()}/api/v1/profile/update-json`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return resp.status == 202
}