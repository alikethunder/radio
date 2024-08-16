import { useEffect } from "react"

import {
  actions,
  store,
  useTrackedStore,
} from "@/store"

import {
  FormState
} from '@/types/FormState'

export const useFormState = (form: HTMLFormElement | null, {
  edit,
  submit,
  reset,
}: {
  edit?: FormState["edit"],
  submit?: FormState["submit"],
  reset?: FormState["reset"],
}, condition?: any) => {

  useEffect(() => {

    console.log('[useFormActionsState] form : ', form)

    if (condition === undefined ? form : condition) {
      if (edit) {
        actions.app.FormActionsState_edit(() => { })
      }
      if (submit) {
        actions.app.FormActionsState_submit(() => { form?.requestSubmit() })
      }
      if (reset) {
        actions.app.FormActionsState_reset(() => { reset() })
      }
    }

    return () => {
      actions.app.FormActionsState_edit(null)
      actions.app.FormActionsState_submit(null)
      actions.app.FormActionsState_reset(null)
      actions.app.FormActionsState_state('read')
    }
  }, [form, condition])



}