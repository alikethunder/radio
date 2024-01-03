import { FC, useEffect, useState } from "react"

import {
  json,
  useLoaderData,
  redirect,
  RouteObject,
  useNavigate,
} from "react-router-dom"

import { CardPageParams } from "@/types/card"

export const CardDescriptionForm = () => {

  const navigate = useNavigate()

  const { pageId } = useLoaderData() as CardPageParams

  return (
    <div className="md:py-4 py-0 sm:px-4 px-2 w-full h-full card_description_form">

    </div>
  )
}