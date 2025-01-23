import { Language } from "./Language"

export type StationCountry = {
  en: string,
  flag: string,
} & {
  [key in Exclude<Language, 'en'>]?: string
}