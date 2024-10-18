import { useEffect } from "react"

export const useLog = (log: boolean | null | undefined, message: string, ...args: any[]) => {
  useEffect(() => {
    if (log) {
      console.log(message, ...args)
    }
  }, args)
}