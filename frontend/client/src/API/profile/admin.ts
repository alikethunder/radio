import { admin as admin_url } from '@/constants/api'

export const admin = async (id?: string) => {
  const resp = await fetch(`${admin_url}${id ?? 'root'}`)
  return resp.status == 200
}