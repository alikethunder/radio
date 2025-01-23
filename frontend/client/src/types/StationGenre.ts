import { Language } from "./Language"

export type StationGenre = {
  en: string,
  icon: string,
  color: string,
} & {
  [key in Exclude<Language, 'en'>]?: string
}