import { FC, useEffect, useState } from "react"

import {
  json,
  useLoaderData,
  redirect,
  RouteObject,
  useNavigate,
} from "react-router-dom"

import { useMediaQuery } from 'react-responsive'

import { CardPageParams } from "@/types/card"

export const CardDescriptionForm = () => {

  const navigate = useNavigate()

  const { pageId } = useLoaderData() as CardPageParams

  const isDesktop = useMediaQuery({ query: '(min-width: 768.1px) and (min-height: 768.1px)' })

  return (
    <div className="md:py-4 py-0 sm:px-4 px-2 w-full h-full card_description_form">

    </div>
  )
}