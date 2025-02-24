import { StationGenre } from "@/types"
import { StationGenreTag } from "@/components"

export const GenreItemTemplate = (option: StationGenre) => <StationGenreTag genre_en={option.en} />
