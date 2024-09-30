import React, { FC, useEffect } from "react"

interface Props {
  onClick?: (e?: React.MouseEvent) => void;
}

export const StationTagRemoveTokenIcon: FC<Props> = ({ onClick, }) => {

  return (
    <div className="flex align-items-center justify-content-center cursor-pointer shadow_on_hover align-self-stretch px-05 border-round text-red-600" {...onClick ? { onClick } : {}}>
      <i className="pi pi-times-circle text-white" />
    </div>
  )
}