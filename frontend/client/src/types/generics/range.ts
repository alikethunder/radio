export type NumRange<T extends number> = number extends T ? number : _Rang<T, []>

type _Rang<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Rang<T, [R['length'], ...R]>