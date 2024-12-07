import { FC, memo, useEffect, useMemo } from "react"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import { actions, useStore, store } from "@/store"

import { tooltip_options } from "@/constants/tooltip_options"
import { useDebounceCallback } from "usehooks-ts"

/* 
page that will include form and will need the form state actions has to set and clear after itself the FormActionsState_submit 
if it will be present the buttons will be rendered according to FormActionsState_state
*/

export const FormActionsState: FC = memo(() => {

  const edit_mode = useStore().app.FormActionsState_state()

  const isValid = useStore().app.FormActionsState_isValid()
  const show = useStore().app.FormActionsState_show()

  const click_edit = useDebounceCallback(() => {
    store.app.FormActionsState_edit()?.()
  }, 50)

  const click_submit = useDebounceCallback(() => store.app.FormActionsState_submit()?.(), 50)

  const click_cancel = useDebounceCallback(() => {
    store.app.FormActionsState_reset()?.()
  }, 50)

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
          className={`p-0 w-2rem h-2rem shadow_on_hover flex-shrink-0`}
          severity={`warning`}

          onClick={click_edit}
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
            className={`p-0 w-2rem h-2rem shadow_on_hover flex-shrink-0`}
            severity={`success`}
            size="small"

            disabled={!isValid}

            onClick={click_submit}
          />

          <Button
            icon="pi pi-times"
            rounded
            outlined
            raised
            aria-label="Отменить"
            tooltip="Отменить"
            tooltipOptions={tooltip_options}
            className="p-0 w-2rem h-2rem shadow_on_hover flex-shrink-0"
            severity='danger'
            size="small"

            onClick={click_cancel}
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
          className="p-0 w-2rem h-2rem cursor-wait flex-shrink-0"
          severity='help'
        />
        break;

      default: return null
    }
  }, [edit_mode, isValid])

  return (
    show ?
      <div className="buttons flex flex-row flex-shrink-0 gap-1 sm:gap-2 align-items-center">
        {navbar_actions}
      </div>
      : <></>
  )
})