import { usePageInList } from "./usePageInList"
import { app_routes } from "@/constants/router"

export const useShowSearchPanel = () => {
  return usePageInList([app_routes.root, app_routes.station$id, app_routes.my_stations, app_routes.shared])
}