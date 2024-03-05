import { 
  actions,
  Stores,
 } from '@/store'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

export const fetcher = (url: string) => fetch(url).then(r => r.json())

export const useFetcher = (url: string | null) => useSWR(url, fetcher)

export const useImmutableFetcher = (url: string | null) => useSWRImmutable(url, fetcher)

export const useImmutableFetcherAndStore = (url: string | null, store: Stores , ...keys: string[]) => useSWRImmutable(url, (url: string) => fetch(url).then(r => r.json().then(json => {
  keys.forEach(key => {
    //@ts-ignore
    actions[store][key](json[key])
  })
  return json
})))