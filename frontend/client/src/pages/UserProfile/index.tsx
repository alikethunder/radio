import { FC, useCallback, useEffect, useMemo, useRef, useState, LegacyRef } from "react"

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

import { IconField } from 'primereact/iconfield'

import { InputIcon } from 'primereact/inputicon'

import { confirmDialog } from 'primereact/confirmdialog'

import './index.sass'

import {
  actions,
  store,
  useStore,
  useTrackedStore,
} from "@/store"

import {
  resize_image,
} from "@/functions"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Tooltip } from "primereact/tooltip"

import {
  app_routes,
} from '@/constants/router'

import { Ripple } from "primereact/ripple"

import {
  useFormState,
  useTranslation,
  useTranslationsSkeleton,
} from '@/hooks'

import { tooltip_options } from "@/constants/tooltip_options"
import { FrontUser } from "@/types"
import { setForm } from "@/functions/setForm"

const private_tooltip_options = { ...tooltip_options, position: 'right' } as const

export const UserProfile = () => {

  const navigate = useNavigate()

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()
  const photo_file_input_ref = useRef<HTMLInputElement>(null)

  const [profile_photo_exists, set_profile_photo_exists] = useState(true)

  const [photo_data_url, set_photo_data_url] = useState<string | null>(null)

  const [photo_blob, set_photo_blob] = useState<Blob | null>(null)

  const user_data = useLoaderData() as FrontUser & { own_profile?: boolean }

  //console.log('user_data : ', user_data)

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const {
    control,
    formState,
    handleSubmit,
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: user_data?.name,
      email: user_data?.email,
    }
  })

  const { errors } = formState

  //console.log("errors : ", errors)

  const onSubmit = useCallback(async (data: any) => {
    console.log('submit : ', data)

    const body = new FormData()

    Object.keys(data).forEach(k => k != 'email' && body.set(k, data[k]))

    if (photo_blob) {
      body.set('photo', photo_blob)
    }

    const id = store.user.id()

    if (id) {
      body.set('id', id)
    }

    if (photo_data_url) {
      actions.user.photo(photo_data_url)
    }

    //console.log('body : ', body.values())

    const response = await fetch('/api/v1/profile/update', {
      method: 'POST',
      body,
    })

    if (response.status == 200) {
      const user = await response.json()

      console.log('[UserProfile] submit response : ', response, user)

      actions.user.update_user_data(user)

      set_photo_blob(null)
    }

    if (data.email != store.user.email()) {

      confirmDialog({
        message: <span>Вы точно хотите поменять email адрес <strong>{store.user.email()}</strong> на <strong>{data.email}</strong>?</span>,
        header: <span className="flex flex-row align-items-center justify-content-center text-2xl sm:text-4xl"><i className="pi pi-question-circle text-4xl sm:text-6xl danger mr-2 text-orange-500"></i>Смена email</span>,
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        closable: false,
        closeOnEscape: false,
        rejectIcon: 'pi pi-times',
        acceptIcon: 'pi pi-check',
        acceptClassName: 'shadow_on_hover p-button-danger p-button-outlined p-button-raised',
        rejectClassName: 'shadow_on_hover p-button-outlined p-button-raised p-button-secondary',
        headerClassName: 'text-center',
        contentClassName: 'text-center sm:text-xl -ml-3 bg-transparent',
        draggable: false,
        className: 'w-30rem max-w-full mx-7 bg-white',
        accept: async () => {
          const update_email_resp = await fetch('/api/v1/profile/request-update-email', {
            method: 'POST',
            body: JSON.stringify({ new_email: data.email })
          })
        },
        reject: () => { setValue('email', store.user.email()) }
      })

    }

    /* 
        // simulate saving 
        await new Promise(res => setTimeout(() => {
          res(true)
        }, 4000))
     */

  }, [photo_blob, photo_data_url])

  //todo add prompt to reset and save form if fields changed
  useFormState({
    reset() {
      set_photo_data_url(null)
      set_photo_blob(null)
      reset()
    },
  }, formState, user_data?.own_profile)

  const [error_email_with_a, _] = useTranslation('error_email_with_@', true)

  const translations = useTranslationsSkeleton([
    ["choose_image", "w-4rem"],
    ["name_cannot_be_empty", 'w-4rem'],
    ["name", "w-2rem"],
    ['error_email_required', 'w-8'],
    ['error_not_real_email', 'w-8'],
    ['only_you_can_see', 'w-4rem'],
  ], true)

  return (
    <div
      className=" w-full overflow-y-auto page user_profile_page flex-grow-1 flex flex-column text-800 md:py-4 py-3 md:px-4 px-3"
    >

      <div className="flex flex-column sm:flex-row">

        <div
          style={{ backgroundImage: `url(${photo_data_url || `/api/v1/files/users/${user_data?.id}/photo`})` }}

          className={`element_with_overlay shadow-2 select-none w-6rem h-6rem md:w-8rem md:h-8rem border-circle flex align-items-center justify-content-center p-ripple bg-no-repeat bg-contain bg-center ${edit_mode ? 'cursor-pointer' : ''}`}

          onClick={() => {
            if (edit_mode) {
              photo_file_input_ref.current?.click()
            }
          }}
        >
          <img
            style={{ display: 'none' }}
            src={`/api/v1/files/users/${user_data?.id}/photo`}

            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              set_profile_photo_exists(false)
            }}
          />

          {
            photo_data_url || profile_photo_exists ? <></> :
              <i className="pi pi-user text-4xl md:text-6xl"></i>
          }

          {
            edit_mode ?
              <>

                <div className="overlay absolute top-0 bottom-0 right-0 left-0 flex align-items-center justify-content-center text-center">

                  <div className="overlay_background surface-900 absolute top-0 bottom-0 right-0 left-0"></div>

                  <div className="overlay_text text-white font-semibold z-1">
                    {translations.choose_image}
                  </div>

                </div>

                <Ripple />

              </>
              : <></>
          }

          <input
            ref={photo_file_input_ref}
            type="file"
            id="fileElem"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              if (e.target.files?.[0]) {
                const [blob, data_url] = await resize_image(e.target.files?.[0])
                set_photo_blob(blob)
                set_photo_data_url(data_url)
              }
            }}
          />

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-1 align-self-start sm:ml-5 mt-3 sm:mt-1 w-25rem max-w-full" ref={setForm}>

          <Controller
            name="name"
            control={control}
            rules={{
              required: {
                value: true,
                message: translations.name_cannot_be_empty,
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
                  <small>
                    {translations.name}
                  </small>
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
                  disabled={!edit_mode}
                  pt={{
                    root: {
                      onInput: (e) => {
                        //@ts-ignore
                        e.target.size = Math.min(Math.max(e.target.value.length - 7, 20), 70)
                      }
                    }
                  }}
                />

                <small className="p-error">
                  {
                    errors[field.name]?.message ?? ' '
                  }
                </small>
              </>
            )}
          />
          {
            user_data?.own_profile ?
              <Controller
                name="email"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.error_email_required,
                  },
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: translations.error_not_real_email,
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
                      <Tooltip target='.pi-lock' {...private_tooltip_options} >
                        {translations.only_you_can_see}
                      </Tooltip>

                      <small>Email </small> <i className="pi pi-lock text-xs" ></i>
                    </label>

                    <IconField iconPosition="left">
                      <InputIcon className="pi pi-envelope"></InputIcon>

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
                        disabled={!edit_mode}
                        autoComplete="email"

                        onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(error_email_with_a)}

                      />
                    </IconField>

                    <small className={`p-error`}>{errors?.[field.name]?.message ?? ' '}</small>
                  </>
                )}
              />
              : <></>
          }

        </form>

      </div>

    </div>
  )
}