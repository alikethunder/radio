import { useStore } from "@/store"

export const useTranslation = (field: string, capitalize?: boolean,): [string, boolean] => {

  const loading = useStore().translations.loading()

  const translation = useStore().translations.get_translation(field, capitalize)

  return [translation, loading]
}