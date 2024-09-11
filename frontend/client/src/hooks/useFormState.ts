import { useEffect, useMemo } from "react"

import {
  actions,
  store,
  useTrackedStore,
  useStore,
} from "@/store"

import {
  FormState
} from '@/types/FormState'
import { useSearchParams } from "react-router-dom"

//condition - condition to rerun useEffect

export const useFormState = (form_actions: FormState, isSubmitting: boolean, condition?: any) => {

  //console.log('form actions : ', form_actions)

  const {
    edit,
    submit,
    reset,
  } = form_actions

  const form = useStore().app.FormActionsState_form()

  const [search, set_search] = useSearchParams()

  const edit_mode = useMemo(() => search.has('edit'), [search])

  useEffect(() => {

    actions.app.FormActionsState_state(isSubmitting ? 'saving' : edit_mode ? 'edit' : 'read')

  }, [edit_mode, isSubmitting])

  useEffect(() => {

    actions.app.FormActionsState_edit(async () => {
      set_search(search => {
        search.set('edit', '')
        return search
      })

      if (edit) {
        await edit()
      }
    })

    actions.app.FormActionsState_submit(async () => {

      await form?.requestSubmit()

      if (submit) {
        await submit()
      }

      set_search(search => {
        search.delete('edit')
        return search
      })

    })

    actions.app.FormActionsState_reset(async () => {

      if (reset) {
        await reset()
      }

      set_search(search => {
        search.delete('edit')
        return search
      })
    })

    return () => {
      actions.app.FormActionsState_edit(undefined)
      actions.app.FormActionsState_submit(undefined)
      actions.app.FormActionsState_reset(undefined)
    }
  }, [form, condition])

}