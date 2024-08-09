import { FC, useEffect } from "react"

import { CreateNewCard } from '@/components'

import { SmallCardContainer } from "@/layout parts"

import { QueryLink } from "@/components"
import './index.sass'

import {
  app_routes,
} from '@/constants/router'

export const Home = () => {

  return (
    <div className="sm:py-5 py-4 sm:px-6 px-4 w-full h-full overflow-y-auto page home_page">

      <QueryLink to={app_routes.signup} className="font-medium no-underline ml-2 text-blue-500 align-self-center">Don't have an account? <span className="font-semibold">Create today!</span></QueryLink>

      <QueryLink to={app_routes.signin} className="font-medium no-underline ml-2 text-blue-500">
        Already have an account? <span className="font-semibold">
          Log in
        </span>
      </QueryLink>
      {/* Description of what this app is for */}

    </div>
  )
}