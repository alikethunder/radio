export const random_number_from_length = (length: number) => length ?
  Math.floor(Math.random() * length)
  : 0