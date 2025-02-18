import { actions, store } from "@/store";
import { Station } from "@/types";
import { random_number_from_length } from "./random_number_from_length";

export const switch_to_random_station = (stations: Station[]) => {
  const cur_station = store.player.current_station()

  let random_station = cur_station

  const get_random_station = () => {
    const random_n = random_number_from_length(stations.length)
    random_station = stations[random_n]
  }

  if (cur_station && random_station) {
    while (!random_station || random_station.id === cur_station.id) {
      get_random_station()
    }
  } else {
    while (!random_station) {
      get_random_station()
    }
  }

  actions.player.current_station(random_station)

  actions.player.playing(true)

}