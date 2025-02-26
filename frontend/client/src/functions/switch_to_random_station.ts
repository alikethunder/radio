import { actions, store } from "@/store";
import { Station } from "@/types";
import { random_number_from_length } from "./random_number_from_length";

export const switch_to_random_station = (stations: Station[]) => {
  const cur_station = store.player.current_station()

  let random_station = cur_station

  const get_random_station = () => {
    if (stations.length > 1) {
      const random_n = random_number_from_length(stations.length)

      random_station = stations[random_n]
    } else {
      random_station = stations[0]
    }
  }

  if (cur_station && random_station) {
    if (stations.length > 1) {
      while (!random_station || random_station?.id === cur_station?.id) {
        get_random_station()
      }
    } else {
      random_station = stations[0]
    }
  } else {
    while (!random_station) {
      get_random_station()
    }
  }

  actions.player.current_station(random_station)

  actions.player.playing(true)

}