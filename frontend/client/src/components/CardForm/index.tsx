import { FC, useCallback, useEffect, useState } from "react"

import {
  json,
  useLoaderData,
  redirect,
  RouteObject,
  useNavigate,
} from "react-router-dom"

import { useMediaQuery } from 'react-responsive'

import { CardPageParams } from "@/types/card"

import './index.sass'

export const CardForm = () => {

  const navigate = useNavigate()

  const { pageId } = useLoaderData() as CardPageParams

  const new_card_ref = useCallback((node: HTMLDivElement) => {
    if (node != null) {
      const rect = node.getBoundingClientRect()
      console.log('[CardForm] card : ', rect)
      const { height } = rect
    }
  }, [])

  return (
    <div className="md:py-4 py-0 sm:px-4 px-2 w-full h-full card_form flex flex-column">

      <div className="form">

      </div>

      <div className="new_card shadow-2 border-round align-self-center" ref={new_card_ref}>

      </div>

    </div>
  )
}