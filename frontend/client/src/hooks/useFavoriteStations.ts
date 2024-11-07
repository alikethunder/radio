import { store, useStore, } from "@/store"

export const useFavoriteStations = (not_hook?: boolean): string[] => {

  const not_logged_favorite_stations = (not_hook ? store : useStore()).persistedApp.favorite_stations()

  const logged_favorite_stations = (not_hook ? store : useStore()).user.favorite_stations()

  const signed_in = (not_hook ? store : useStore()).auth.signedin()

  return signed_in ? logged_favorite_stations : not_logged_favorite_stations
}