import { useEffect } from "react"

import {
  actions,
  store,
  useTrackedStore,
} from "@/store"

import {
  FormState
} from '@/types/FormState'

export const useFormState = (form_actions: FormState, form?: HTMLFormElement, condition?: any) => {

  //console.log('form actions : ', form_actions)

  const {
    edit,
    submit,
    reset,
  } = form_actions

  useEffect(() => {

    if (edit) {
      actions.app.FormActionsState_edit(edit)
    }
    if (submit) {
      actions.app.FormActionsState_submit(submit)
    }
    if (reset) {
      actions.app.FormActionsState_reset(reset)
    }


    return () => {
      actions.app.FormActionsState_edit(null)
      actions.app.FormActionsState_submit(null)
      actions.app.FormActionsState_reset(null)
      actions.app.FormActionsState_state('read')
    }
  }, [form, condition])



}