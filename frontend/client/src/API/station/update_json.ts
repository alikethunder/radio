export const update = async (id: string, body: { [x: string]: any }) => {
  const resp = await fetch(`${window.location.origin}/api/v1/radio/update/${id}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return resp
}