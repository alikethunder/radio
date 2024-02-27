import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

export const fetcher = (url: string) => fetch(url).then(r => r.json())

export const useFetcher = (url: string | null) => useSWR(url, fetcher)

export const useImmutableFetcher = (url: string | null) => useSWRImmutable(url, fetcher)