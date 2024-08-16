import { FC, useCallback, useEffect, useMemo, useState } from "react"

import {
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  Controller,
  useForm
} from 'react-hook-form'
import { classNames } from 'primereact/utils'

import { Button } from 'primereact/button'

import { InputText } from "primereact/inputtext"

import { CreateNewCard } from '@/components'

import { SmallCardContainer } from "@/layout parts"

import { QueryLink } from "@/components"

import './index.sass'

import {
  actions,
  store,
  useTrackedStore,
} from "@/store"

import {
  useImmutableFetcher,
  sortByPriority,
  useImmutableFetcherAndStore,
} from "@/functions"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Tooltip } from "primereact/tooltip"

import {
  app_routes,
} from '@/constants/router'

import { Ripple } from "primereact/ripple"

import { useFormState } from '@/hooks'

import { tooltip_options } from "@/constants/tooltip_options"

const private_tooltip_options = { ...tooltip_options, position: 'right' } as const

export const UserProfile = () => {

  const navigate = useNavigate()

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const [form, set_form] = useState<HTMLFormElement | null>(null)

  const user_data = useLoaderData()

  console.log('user_data : ', user_data)

  const edit_mode = useTrackedStore().app.FormActionsState_state()

  const {
    control,
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    getValues,
    reset,
    clearErrors,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: user_data?.name,
      email: user_data?.email,
    }
  })

  //console.log("errors.name : ", errors.name)

  const onSubmit = (data) => {
    console.log('submit : ', data)
  }

  //todo add propt to reset and save form if fields changed
  useFormState(form, {
    submit: () => {
      form?.requestSubmit()
    },
    reset: () => {
      reset()
    },
  })

  /* useEffect(() => {
    if (form) {
      actions.app.FormActionsState_edit(()=>{})
      actions.app.FormActionsState_submit(() => { form.requestSubmit() })
      actions.app.FormActionsState_reset(() => { reset() })
    }
    return () => {
      actions.app.FormActionsState_edit(null)
      actions.app.FormActionsState_submit(null)
      actions.app.FormActionsState_reset(null)

    }
  }, [form]) */

  return (
    <div
      className=" w-full overflow-y-auto page user_profile_page flex-grow-1 flex flex-column text-800 md:py-4 py-3 md:px-4 px-3"
    >

      <div className="flex flex-column sm:flex-row">

        <div className="profile_picture shadow-2 cursor-pointer select-none w-5rem h-5rem md:w-7rem md:h-7rem border-circle flex align-items-center justify-content-center p-ripple align-self-center" onClick={() => {
          if (edit_mode == 'edit') {

          }
        }}>

          <i className="pi pi-user text-4xl md:text-6xl"></i>

          {
            edit_mode == 'edit' ?
              <>
                <div className="overlay absolute top-0 bottom-0 right-0 left-0 flex align-items-center justify-content-center text-center">

                  <div className="overlay_background surface-900 absolute top-0 bottom-0 right-0 left-0"></div>

                  <div className="overlay_text text-white font-semibold z-1">
                    Choose image
                  </div>

                </div>

                <Ripple />
              </>
              : <></>
          }

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2 align-self-start sm:ml-5 mt-3 sm:mt-1 w-25rem" ref={e => set_form(e)}>

          <Controller
            name="name"
            control={control}
            rules={{ required: 'Project name cannot be empty' }}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className={classNames(
                    {
                      'p-error': errors[field.name]
                    },
                    'text-600'
                  )}
                >
                  <small>Имя</small>
                </label>

                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames(
                    {
                      'p-invalid': fieldState.error,
                    },
                  )}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                  onBlur={field.onBlur}
                  disabled={edit_mode != 'edit'}
                  pt={{
                    root: {
                      onInput: (e) => {
                        //@ts-ignore
                        e.target.size = Math.min(Math.max(e.target.value.length - 7, 20), 70)
                      }
                    }
                  }}
                />

                <small className="p-error">{errors[field.name]?.message ?? ' '}</small>
              </>
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Please, enter your e-mail',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please, enter your real e-mail",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className={classNames(
                    {
                      'p-error': errors[field.name]
                    },
                    'text-600'
                  )}
                >
                  <Tooltip content="Видно только вам" target='.pi-lock' {...private_tooltip_options} />

                  <small>E-mail </small> <i className="pi pi-lock text-xs" ></i>
                </label>

                <span className="p-input-icon-left">
                  <i className="pi pi-envelope"></i>

                  <InputText
                    type="email"
                    id={field.name}
                    value={field.value}

                    className={classNames(
                      "w-full",
                      { 'p-invalid': fieldState.error }
                    )}
                    onInput={() => clearErrors('email')}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    disabled={edit_mode != 'edit'}
                    autoComplete="email"

                    onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Enter an email that contains "@" Example: info@roshni.nl')}

                  />
                </span>

                <small className={`p-error`}>{errors?.[field.name]?.message ?? ' '}</small>
              </>
            )}
          />


        </form>

      </div>
      {/* 
        <QueryLink to={app_routes.signup} className="font-medium no-underline ml-2 text-blue-500 align-self-center">Don't have an account? <span className="font-semibold">Create today!</span></QueryLink>

        <QueryLink to={app_routes.signin} className="font-medium no-underline ml-2 text-blue-500">
          Already have an account? <span className="font-semibold">
            Log in
          </span>
        </QueryLink> */}


      <div className="shadow-3 flex-grow-1 mt-8 flex align-items-center justify-content-center">
        Editor
      </div>


    </div>
  )
}