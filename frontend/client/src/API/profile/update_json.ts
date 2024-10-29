export const update_json = async (body: { [x: string]: any }) => {
  const resp = await fetch(`/api/v1/profile/update-json`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return resp.status == 202
}