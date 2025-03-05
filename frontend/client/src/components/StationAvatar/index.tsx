import { useLog } from "@/hooks";
import { FC, memo, useEffect, useState, } from "react"

type props = {
  id?: string;
  className?: string;
}

export const StationAvatar: FC<props> = memo(({ id, className }) => {

  const [image_loading, set_image_loading] = useState(true)

  const [station_avatar, set_station_avatar] = useState<string>(`/api/v1/files/stations/${id}/avatar`)

  useEffect(() => {
    set_station_avatar(`/api/v1/files/stations/${id}/avatar`)
  }, [id])

  return (
    id ?
      <div className={`flex align-items-center justify-content-center relative ${className ?? ''}`} >

        {
          image_loading ?
            <i className="pi pi-spin pi-spinner text-400 absolute top-0 left-0 right-0 bottom-0 m-auto w-2rem h-2rem z-1" style={{ fontSize: '2rem' }}></i>
            : <></>
        }

        <img
          src={station_avatar}

          onError={({ currentTarget }) => {
            //currentTarget.onerror = null

            set_station_avatar('/radio.png')
          }}

          onLoad={(e) => {
            set_image_loading(false)
          }}

          loading="lazy"

          className="h-full z-2 cursor-pointer"
        />
      </div>
      : <></>
  )
}, (o, n) => {
  return o?.id == n?.id
    && o?.className == n?.className
})