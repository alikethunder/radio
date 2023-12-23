import { FC, useEffect } from "react"
import { json, useLoaderData, redirect, RouteObject } from "react-router-dom"

import './index.sass'

export const Card = () => {
  const { id } = useLoaderData() as { id: string }
  console.log('[Card] id : ', id)

  return (
    <div className="sm:py-5 py-4 sm:px-6 px-4 w-full h-full overflow-y-auto page card_page">

{/* this is pseudo markup to see the structure */}
    <div className="tabs"></div>

      <div className="form">

      </div>
      
    <div className="content">
      <div className="card">

      </div>
    </div>

    </div>
  )
}