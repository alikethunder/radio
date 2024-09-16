import { useEffect } from "react"

export const useLog = (message: string, ...args: any[]) => {
  useEffect(() => {
    console.log(message, ...args)
  }, args)
}