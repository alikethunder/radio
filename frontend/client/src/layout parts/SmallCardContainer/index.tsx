import React, { FC, useEffect } from "react"

import './index.sass'

interface Props {
  children?: React.ReactNode,
  className?: string,
}

export const SmallCardContainer: FC<Props> = ({ children, className }) => {

  return (
    <div
      className={`flex-shrink-0 shadow-2 border-round SmallCardContainer ${className ?? ''}`}
    >
      {children}
    </div>
  )
}