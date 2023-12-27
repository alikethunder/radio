import React, { FC, useEffect } from "react"

import { QueryLink } from "@/components"

import { Ripple } from 'primereact/ripple'

import './index.sass'

export const CreateNewCard: FC = () => {

  return (
    <QueryLink to="/card/create" className={`p-ripple add_cart w-full h-full flex flex-column justify-content-center align-content-center`}>
      <i className="pi pi-plus-circle text-primary align-self-center"></i>
      <div className="text-center text-color">Create new card</div>
      <Ripple />
    </QueryLink>
  )
}