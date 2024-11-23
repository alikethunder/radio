import station_tag_colors from '&/settings/station_tag_colors.json'

import {
  random_number_from_length
} from '@/functions/random_number_from_length'

export const random_station_tag_color = () => station_tag_colors[random_number_from_length(station_tag_colors.length)]