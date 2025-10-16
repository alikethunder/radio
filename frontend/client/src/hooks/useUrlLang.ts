import { Language } from "@/types"
import { useSearchParams } from "react-router-dom"

export const useUrlLang = () => {
  const [searchParams, _] = useSearchParams()
  return searchParams.get('language') as Language
}