import { useCallback, useEffect, useMemo } from "react"

import {
  actions,
  store,
  useTrackedStore,
  useStore,
} from "@/store"

import {
  FormState
} from '@/types/FormState'

import {
  useLoaderData,
  useSearchParams,
  useNavigate,
} from "react-router-dom"

//show - to show form actions

export const useFormState = (form_actions: FormState, formState: { isValid: boolean; isSubmitting: boolean; }, show?: any) => {

  //console.log('form actions : ', form_actions)

  const {
    edit,
    submit,
    reset,
  } = form_actions

  const { isSubmitting, isValid } = formState

  useEffect(() => {
    actions.app.FormActionsState_isValid(isValid)
  }, [isValid])

  const [search, set_search] = useSearchParams()

  useEffect(() => {
    //console.log('show : ', show)

    actions.app.FormActionsState_show(Boolean(show))

    return () => {
      actions.app.FormActionsState_show(false)
    }
  }, [show])

  const form = useStore().app.FormActionsState_form()

  const edit_mode = useMemo(() => search.has('edit'), [search])

  const loader_data = useLoaderData() as {
    id?: string;
  }

  const navigate = useNavigate()

  //console.log('[useFormState] loader_data : ', loader_data)

  //console.log('[useFormState] edit_mode : ', edit_mode)

  useEffect(() => {

    actions.app.FormActionsState_state(
      show ? (
        isSubmitting ? 'saving'
          :
          (
            edit_mode ? 'edit' : 'read'
          )
      ) : 'read'
    )

  }, [edit_mode, isSubmitting, show])

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

    return () => {
      actions.app.FormActionsState_edit(undefined)
    }
  }, [form, edit])


  useEffect(() => {

    actions.app.FormActionsState_submit(async () => {
      if (isValid) {
        await form?.requestSubmit()

        if (submit) {
          await submit()
        }

        set_search(search => {

          search.delete('edit')

          return search
        })
      }

    })

    return () => {
      actions.app.FormActionsState_submit(undefined)
    }
  }, [form, submit, isValid,])


  useEffect(() => {

    actions.app.FormActionsState_reset(async () => {

      if (reset) {
        await reset()
      }

      set_search(search => {

        search.delete('edit')

        return search
      })

      if (loader_data.id == 'new') {
        navigate(-1)
      }
    })

    return () => {
      actions.app.FormActionsState_reset(undefined)
    }
  }, [form, reset,])

  useEffect(() => {
    return () => {
      //state to 'read' on page change
      set_search(search => {

        search.delete('edit')

        return search
      })
    }
  }, [])

}