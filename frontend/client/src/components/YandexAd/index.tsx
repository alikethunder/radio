import { FC, memo, useEffect, useRef, useState, } from "react"

import {
  useStore,
} from "@/store"

type Props = {
  id: string; //banner id
  className?: string;
  interval?: number;  //interval in ms to change ads
  onlyDesktop?: boolean; //ad will be shown only on desktop
  style?: React.CSSProperties;
  update_dependency?: any;
}

import { useMobile, } from "@/hooks"

const ads_enabled = true

export const YandexAd: FC<Props> = memo(({ update_dependency, onlyDesktop, className, id, interval, style, ...rest }) => {

  if (!ads_enabled || window.location.port == '3000') return <></>

  const mobile = useMobile()

  const theme = useStore().persistedApp.theme()

  const [counter, set_counter] = useState(1)

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInterval(() => {
      set_counter(counter => counter + 1)
    }, interval ?? 35000)
  }, [])

  useEffect(() => {
    set_counter(c => c + 1)
  }, [update_dependency])

  useEffect(() => {
    if (ads_enabled && (onlyDesktop ? !mobile : true)) {

      if (counter > 1) {
        const ya = document.getElementById(`yandex_rtb_${id}-${counter - 1}`)
        const new_ya = document.createElement('div')
        new_ya.id = `yandex_rtb_${id}-${counter}`
        new_ya.className = `w-full h-full ${className ?? ''}`

        container.current?.insertBefore(new_ya, ya)

        ya?.remove()

        window.yaContextCb.push(() => {
          window.Ya.Context.AdvManager.render({
            "blockId": id,
            "renderTo": `yandex_rtb_${id}-${counter}`,
            "async": true,
            darkTheme: theme === 'dark',
            onError: (data: any) => {
              console.log('[YandexAd] error: ', data)
            },
          })
        })
      }
    }
  }, [
    theme,
    mobile,
    id,
    counter,
    onlyDesktop,
  ])

  return (
    <div className={`flex align-items-stretch ${className ?? ''} `} ref={container} {...style ? { style } : {}} >
      <div id={`yandex_rtb_${id}-1`} className={`w-full h-full ${className ?? ''}`} />
    </div >
  )
})