import { FC, memo, useEffect, useMemo, useRef, useState } from "react"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import { actions, useStore, store } from "@/store"

import { useDebounceCallback } from "usehooks-ts"
import { useHideTooltip, useTranslations } from "@/hooks"

export const ThemeSwitcher: FC = memo(() => {

  const theme = useStore().persistedApp.theme()

  const tooltipOptions = useHideTooltip()

  const change_theme = useDebounceCallback(() => {
    const new_theme = store.persistedApp.theme() == 'light' ? 'dark' : 'light'

    actions.persistedApp.theme(new_theme)
    localStorage.setItem('theme', new_theme)
  }, 50)

  const [theme_loading, set_theme_loading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      set_theme_loading(true)

      fetch(`${window.location.origin}/assets/themes/soho_${theme}.css`).then(resp => {
        return resp.text()
      }).then(text => {
        const style = document.getElementById("theme_css")
        if (style) {
          style.innerHTML = text
        }
      }).finally(() => {
        set_theme_loading(false)
      })
    }
  }, [theme])

  const current_theme_icon = useMemo(() => {
    return theme_loading ?
      `pi-spin ${theme == 'light' ? 'pi-sun' : 'pi-moon'}`
      :
      theme == 'light' ? 'pi-moon' : 'pi-sun'
  }, [theme_loading, theme])

  const [translations] = useTranslations([
    'switch_theme',
  ], true)

  return (
    <Button
      icon={`pi ${current_theme_icon}`}
      rounded
      outlined
      raised
      aria-label={translations.switch_theme}
      tooltip={translations.switch_theme}
      {...{ tooltipOptions }}
      className="p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center icon_button_text_shadow"
      style={{
        color: theme_loading ?
          theme == 'light' ? '#fff' : '#000'
          :
          theme == 'light' ? '#000' : '#fff',
        ...theme_loading ?
          theme == 'light' ? {} : { borderWidth: '1.6px' }
          :
          theme == 'light' ? { borderWidth: '1.6px' } : {},
      }}

      onClick={change_theme}
    />
  )
})