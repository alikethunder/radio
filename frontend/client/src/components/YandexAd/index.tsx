import { FC, memo, useEffect, useState, } from "react"

import {
  useStore,
} from "@/store"

type Props = {
  id: string;
  className?: string;
  interval?: number;
  onlyDesktop?: boolean;
}

import { useMobile, } from "@/hooks"

export const YandexAd: FC<Props> = memo(({ onlyDesktop, className, id, interval, ...rest }) => {

  const mobile = useMobile()

  const theme = useStore().persistedApp.theme()

  const [counter, set_counter] = useState(0)

  const [hide, set_hide] = useState(false)

  useEffect(() => {
    setInterval(() => {
      set_counter(counter + 1)
    }, interval ?? 20000)
  }, [])

  useEffect(() => {
    if (onlyDesktop ? !mobile : true) {
      window.yaContextCb.push(() => {
        window.Ya.Context.AdvManager.render({
          "blockId": id,
          "renderTo": `yandex_rtb_${id}`,
          "async": true,
          darkTheme: theme === 'dark',
          onError: (data: any) => {
            console.log('[YandexAd] error: ', data)
            set_hide(true)
          },
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
  ])

  return (
    hide ? <></> :
      <div id={`yandex_rtb_${id}`} className={`${className ?? ''} `}></div>
  )
})