import React, { FC, useEffect } from "react"

import './index.sass'

export const CreateNewCard: FC = () => {

  return (
    <div className={`add_cart w-full h-full flex flex-column justify-content-center align-content-center`}>
      <i className="pi pi-plus-circle text-primary align-self-center"></i>
      <div className="text-center text-color">Create new card</div>
    </div>
  )
}