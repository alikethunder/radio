export const admin = async (id?: string) => {
  const resp = await fetch(`/api/v1/profile/admin/${id ?? 'root'}`)
  return resp.status == 200
}