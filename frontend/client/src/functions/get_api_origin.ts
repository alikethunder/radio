export const get_api_origin = () => {
  console.log('api origin : ', `http://localhost:${process.env.API_PORT}`)
  console.log('env : ', process.env.ENV)

  return typeof window !== 'undefined' ? window.location.origin : `http${process.env.ENV === 'prod' ? 's' : ''}://localhost:${process.env.API_PORT}`
}