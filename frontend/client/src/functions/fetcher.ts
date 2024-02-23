import useSWR from 'swr'

export const useFetcher = (url: string | null) => useSWR(url, (url: string) => fetch(url).then(r => r.json()))
