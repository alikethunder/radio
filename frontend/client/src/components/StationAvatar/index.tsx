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
      <div className={`bg-no-repeat bg-contain bg-center flex align-items-center justify-content-center ${className ?? ''}`}
        style={{
          backgroundImage: `url(${station_avatar})`,
        }} >

        <img
          style={{ display: 'none' }}
          src={station_avatar}

          onError={({ currentTarget }) => {
            //currentTarget.onerror = null

            set_station_avatar('/radio.png')
          }}

          onLoad={(e) => {
            set_image_loading(false)
          }}

          loading="lazy"
        />

        {
          image_loading ?
            <i className="pi pi-spin pi-spinner text-400" style={{ fontSize: '2rem' }}></i>
            : <></>
        }
      </div>
      : <></>
  )
}, (o, n) => {
  return o?.id == n?.id
    && o?.className == n?.className
})