import React, { FC, useEffect} from "react"

import './index.sass'

interface Props {
  children?: React.ReactNode
}

export const SmallCardContainer: FC<Props> = ({children}) => {

  return (
    <div className="cursor-pointer shadow-2 border-round SmallCardContainer transition-all hover:shadow-4 transition-duration-250">
      {children}
    </div>
  )
}