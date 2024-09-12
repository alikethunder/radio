import { FC, useEffect, useMemo } from "react"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import {
  logout,
} from '@/functions'

import { actions, useStore, store } from "@/store"

import { usePageInList } from '@/hooks'

import {
  app_routes,
  auth_routes,
} from '@/constants/router'

import { tooltip_options } from "@/constants/tooltip_options"

/* 
page that will include form and will need the form state actions has to set and clear after itself the FormActionsState_submit 
if it will be present the buttons will be rendered according to FormActionsState_state
*/

export const FormActionsState: FC = () => {

  const edit_mode = useStore().app.FormActionsState_state()

  const edit = useStore().app.FormActionsState_edit()
  const submit = useStore().app.FormActionsState_submit()
  const reset = useStore().app.FormActionsState_reset()
  const isValid = useStore().app.FormActionsState_isValid()

  const show_actions = useMemo(() => submit || edit || reset, [
    submit,
    edit,
    reset,
  ])

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
          tooltipOptions={tooltip_options}
          className={`p-0 w-2rem h-2rem shadow_on_hover`}
          severity={`warning`}

          onClick={() => {
            store.app.FormActionsState_edit()?.()
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
            tooltipOptions={tooltip_options}
            className={`p-0 w-2rem h-2rem shadow_on_hover`}
            severity={`success`}
            size="small"

            disabled={!isValid}

            onClick={() => store.app.FormActionsState_submit()?.()}
          />

          <Button
            icon="pi pi-times"
            rounded
            outlined
            raised
            aria-label="Отменить"
            tooltip="Отменить"
            tooltipOptions={tooltip_options}
            className="p-0 w-2rem h-2rem shadow_on_hover"
            severity='danger'
            size="small"

            onClick={() => {
              store.app.FormActionsState_reset()?.()
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
          tooltipOptions={tooltip_options}
          className="p-0 w-2rem h-2rem cursor-wait"
          severity='help'
        />
        break;

      default: return null
    }
  }, [edit_mode, isValid])

  return (
    show_actions ?
      <div className="buttons flex flex-row gap-2 align-items-center pl-2">
        {navbar_actions}
      </div>
      : <></>
  )
}