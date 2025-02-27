import { isRussia } from "@/functions"
import { useMemo } from "react"

export const useRussia = () => {
  const is_rus = useMemo(() => isRussia(), [])
  return is_rus
}