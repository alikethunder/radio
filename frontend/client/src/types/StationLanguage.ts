import type { Language } from './Language'

export type StationLanguage = {
  en: string,
} & {
  [key in Exclude<Language, 'en'>]?: string
}