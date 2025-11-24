import {  useStore } from "@/store"

type ObjectFromList<T extends string> = {
  [K in T[][number]]: string;
}

export const useTranslations = <T extends string>(fields: T[], capitalize?: boolean): [translations: ObjectFromList<T>, loading: boolean] => {

  const loading = useStore().translations.loading()

  const translations = useStore().translations.get_translations(fields, capitalize) as unknown as ObjectFromList<T>

  return [translations, loading]
}