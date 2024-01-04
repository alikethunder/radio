import { useCallback, useState } from "react"

export const useRefCallback = (...deps: any[]): [Element | undefined, (n: Element) => void] => {
  const [node, setNode] = useState<Element>()

  const ref = useCallback((n: Element) => {
    if (n != null) {
      setNode(n)
    }
  }, [...deps])

  return [node, ref]
}