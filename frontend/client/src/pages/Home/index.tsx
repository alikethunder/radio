import { FC, useEffect} from "react"

import { SmallCardContainer } from "@/layout parts"

import './index.sass'

export const Home = () => {

  return (
    <div className="sm:pt-5 pt-4 sm:px-6 px-4 pb-0 w-full h-full overflow-y-auto page home_page">

      <SmallCardContainer/>

      <SmallCardContainer/>
      <SmallCardContainer/>
      <SmallCardContainer/>
      <SmallCardContainer/>
      <SmallCardContainer/>

    </div>
  )
}