export const random_number_from_length = (length: number) => length ?
  Math.floor((Math.random() - 0.00001) * length)
  : 0