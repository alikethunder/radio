export const objectToQuery = (parameters: { [x: string]: any; }) => {
  return Object.getOwnPropertyNames(parameters)
    .filter(key => !!parameters[key])
    .map(key => `${key}=${parameters[key]}`)
    .join('&')
}