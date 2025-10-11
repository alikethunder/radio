import { get_api_origin } from "@/functions"

export const admin = async (id?: string) => {
  const resp = await fetch(`${get_api_origin()}/api/v1/profile/admin/${id ?? 'root'}`)
  return resp.status == 200
}