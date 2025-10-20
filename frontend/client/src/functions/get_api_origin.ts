export const get_api_origin = () => {

  return typeof window !== 'undefined' ? window.location.origin : `${process.env.ENV === 'prod' ? 'https://radio.best' : `http://localhost${process.env.API_PORT}`}:`
}