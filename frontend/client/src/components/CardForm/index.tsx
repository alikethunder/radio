import { FC, useCallback, useEffect, useState } from "react"

import {
  json,
  useLoaderData,
  redirect,
  RouteObject,
  useNavigate,
} from "react-router-dom"

import { CardPageParams } from "@/types/card"

import './index.sass'

export const CardForm = () => {

  const navigate = useNavigate()

  const { pageId } = useLoaderData() as CardPageParams

  const [height, setHeight] = useState<number | null>(null)

  const new_card_ref = useCallback((node: HTMLDivElement) => {
    if (node != null) {
      const { height } = node.getBoundingClientRect()

      setHeight(height)

      new ResizeObserver(() => {

        const { height } = node.getBoundingClientRect()
        
        setHeight(height)

      }).observe(node)
    }
  }, [])

  return (
    <div className="md:py-4 py-0 sm:px-4 px-2 w-full h-full card_form flex flex-column">

      <div className="form">

      </div>

      <div className="new_card shadow-2 border-round align-self-center" ref={new_card_ref} style={height ? { '--card-height': `${height}px` } : {}} >

      </div>

    </div >
  )
}