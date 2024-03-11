import {
  actions,
  Stores,
} from '@/store'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

export const fetcher = (url: string) => fetch(url).then(r => r.json())

export const useFetcher = (url: string | null) => useSWR(url, fetcher)

export const useImmutableFetcher = (url: string | null) => useSWRImmutable(url, fetcher)

export const useImmutableFetcherAndStore = (url: string | null, store: Stores, ...keys: string[]) => {
  const { error, data, isLoading } = useSWRImmutable(url, (url: string) => fetch(url).then(r => r.json()))

  if (error) {
    console.log(`[${url}] error : `, error)
    console.log(`[${url}] store : `, store)
    console.log(`[${url}] keys : `, keys)
  }
  keys.forEach(key => {
    if (data) {
      //@ts-ignore 
      actions[store][key](data[key])
    }
    //@ts-ignore
    actions[store][`${key}_loading`](isLoading)
  })

}