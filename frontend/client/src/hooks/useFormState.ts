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

    console.log('[useFormStateActions] form : ', form)

    if (condition === undefined ? form : condition) {
      if (edit) {
        actions.app.FormStateActions_edit(() => { })
      }
      if (submit) {
        actions.app.FormStateActions_submit(() => { form?.requestSubmit() })
      }
      if (reset) {
        actions.app.FormStateActions_reset(() => { reset() })
      }
    }

    return () => {
      actions.app.FormStateActions_edit(null)
      actions.app.FormStateActions_submit(null)
      actions.app.FormStateActions_reset(null)
      actions.app.FormStateActions_state('read')
    }
  }, [form, condition])



}