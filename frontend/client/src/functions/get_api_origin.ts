export const get_api_origin = () =>
  typeof window !== 'undefined' ? window.location.origin : `http://localhost:${process.env.API_PORT}`
