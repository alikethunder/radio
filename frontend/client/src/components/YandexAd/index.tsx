import { FC, memo, useEffect, useRef, useState, } from "react"

import {
  useStore,
} from "@/store"

type Props = {
  id: string; //banner id
  className?: string;
  interval?: number;  //interval in ms to change ads
  onlyDesktop?: boolean; //ad will be shown only on desktop
  hideOpacity?: boolean; // hide container with opacity 0
  style?: React.CSSProperties;
  update_dependency?: any;
}

import { useMobile, } from "@/hooks"

export const YandexAd: FC<Props> = memo(({ update_dependency, hideOpacity, onlyDesktop, className, id, interval, style, ...rest }) => {

  const mobile = useMobile()

  const theme = useStore().persistedApp.theme()

  const [counter, set_counter] = useState(1)

  const [hide, set_hide] = useState(false)

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInterval(() => {
      set_counter(counter => counter + 1)
    }, interval ?? 35000)
  }, [])

  useEffect(() => {
    if (onlyDesktop ? !mobile : true) {

      if (counter > 1) {
        const ya = document.getElementById(`yandex_rtb_${id}-${counter - 1}`)
        const new_ya = document.createElement('div')
        new_ya.id = `yandex_rtb_${id}-${counter}`
        new_ya.className = `w-full h-full ${className ?? ''}`

        container.current?.insertBefore(new_ya, ya)

        ya?.remove()
      }

      window.yaContextCb.push(() => {
        window.Ya.Context.AdvManager.render({
          "blockId": id,
          "renderTo": `yandex_rtb_${id}-${counter}`,
          "async": true,
          darkTheme: theme === 'dark',
          onError: (data: any) => {
            console.log('[YandexAd] error: ', data)
            set_hide(true)
          },
          onRender: (data: any) => {
            set_hide(false)
          }
        })
      })
    } else {
      set_hide(true)
    }
  }, [
    theme,
    mobile,
    id,
    counter,
    onlyDesktop,
    update_dependency,
  ])

  return (
    <div className={`flex align-items-stretch ${className ?? ''} ${hide ? (hideOpacity ? 'opacity-0' : 'max-h-0 overflow-hidden') : ''}`} ref={container} {...style ? { style } : {}}>
      <div id={`yandex_rtb_${id}-1`} className={`w-full h-full ${className ?? ''}`} />
    </div>
  )
})