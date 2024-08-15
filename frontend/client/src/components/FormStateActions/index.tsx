import { FC, useEffect, useMemo } from "react"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import {
  logout,
} from '@/functions'

import { actions, useStore } from "@/store"

import { usePageInList } from '@/hooks'

import {
  app_routes,
  auth_routes,
} from '@/constants/router'

const navbar_actions_tooltip_options = { showDelay: 300, hideDelay: 200, position: 'bottom', closeOnEscape: true, } as const

/* 
page that will include form and will need the form state actions has to set and clear after itself the FormStateActions_submit 
if it will be present the buttons will be rendered according to FormStateActions_state
*/

export const FormStateActions: FC = () => {

  const [authPage, checked_auth_page] = usePageInList(auth_routes)

  const current_page = useStore().app.current_page()

  const edit_mode = useStore().app.FormStateActions_state()
  const edit = useStore().app.FormStateActions_edit()
  const submit = useStore().app.FormStateActions_submit()
  const reset = useStore().app.FormStateActions_reset()

  const navbar_actions = useMemo(() => {
    switch (edit_mode) {
      case 'read':
        return <Button
          icon="pi pi-file-edit"
          rounded
          outlined
          raised
          aria-label="Редактировать"
          tooltip="Редактировать"
          tooltipOptions={navbar_actions_tooltip_options}
          className={`p-0 w-2rem h-2rem shadow_on_hover`}
          severity={`warning`}

          onClick={() => {
            actions.app.FormStateActions_state('edit')
            edit?.()
          }}
        />
        break;

      case 'edit':
        return <>
          <Button
            icon="pi pi-check"
            rounded
            outlined
            raised
            aria-label="Сохранить"
            tooltip="Сохранить"
            tooltipOptions={navbar_actions_tooltip_options}
            className={`p-0 w-2rem h-2rem shadow_on_hover`}
            severity={`success`}
            size="small"

            onClick={() => submit?.()}
          />

          <Button
            icon="pi pi-times"
            rounded
            outlined
            raised
            aria-label="Отменить"
            tooltip="Отменить"
            tooltipOptions={navbar_actions_tooltip_options}
            className="p-0 w-2rem h-2rem shadow_on_hover"
            severity='danger'
            size="small"

            onClick={() => {
              actions.app.FormStateActions_state('read')
              reset?.()
            }}
          />
        </>
        break;

      case 'saving':
        return <Button
          icon="pi pi-spin pi-cog"
          rounded
          outlined
          raised
          aria-label="Сохраняется"
          tooltip="Сохраняется"
          tooltipOptions={navbar_actions_tooltip_options}
          className="p-0 w-2rem h-2rem cursor-wait"
          severity='help'
        />
        break;

      default: return null
    }
  }, [edit_mode])

  return (
    submit ?
      <div className="buttons flex flex-row gap-2 align-items-center pl-2">
        {navbar_actions}
      </div>
      : <></>
  )
}