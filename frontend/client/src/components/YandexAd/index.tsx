import { FC, memo, useEffect, useMemo, useRef, useState, } from "react"

import {
  useStore,
} from "@/store"

type Props = {
  id: string; //banner id
  className?: string;
  interval?: number;  //interval in ms to change ads
  style?: React.CSSProperties;
  update_dependency?: any;
  additional_render_params?: { [x: string]: any };
  only_rus?: boolean;
}

import { useMobile, useRussia, } from "@/hooks"

const ads_enabled = true

export const YandexAd: FC<Props> = memo(({ update_dependency, additional_render_params, className, id, interval, style, only_rus, ...rest }) => {

  const is_rus = useRussia()

  if (
    typeof window === 'undefined'
    ||
    (
      only_rus ? !is_rus : false
    )
    || !ads_enabled
    || window?.location?.port == '5757'
  ) return <></>

  const mobile = useMobile()

  const theme = useStore().persistedApp.theme()

  const [counter, set_counter] = useState(1)

  const container = useRef<HTMLDivElement>(null)

  const int = useMemo(() => {
    const i = interval ?? 35000
    return i < 30000 ? 30000 : i
  }, [interval])

  useEffect(() => {
    setInterval(() => {
      set_counter(counter => counter + 1)
    }, int)
  }, [])

  useEffect(() => {
    set_counter(c => c + 1)
  }, [update_dependency])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (ads_enabled) {

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
                console.log(`[YandexAd] ${id} error: `, data)
              },
              ...(additional_render_params ?? {}),
            })
          })
        }
      }
    }
  }, [
    theme,
    mobile,
    id,
    counter,
  ])

  return (
    <div className={`flex align-items-stretch ${className ?? ''} `} ref={container} {...style ? { style } : {}} >
      <div id={`yandex_rtb_${id}-1`} className={`w-full h-full ${className ?? ''}`} />
    </div >
  )
})