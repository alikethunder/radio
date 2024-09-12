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

import { confirmDialog } from 'primereact/confirmdialog'

import './index.sass'

import {
  actions,
  store,
  useStore,
  useTrackedStore,
} from "@/store"

import {
  useImmutableFetcher,
  sortByPriority,
  useImmutableFetcherAndStore,
  resize_image,
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
import { FrontUser } from "@/types"
import { setForm } from "@/functions/setForm"

const private_tooltip_options = { ...tooltip_options, position: 'right' } as const

export const Station = () => {

  const navigate = useNavigate()

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const photo_file_input_ref = useRef<HTMLInputElement>(null)

  const [profile_photo_exists, set_profile_photo_exists] = useState(true)

  const photo_data_url = useStore().app.user_photo_data_url()

  const [photo_blob, set_photo_blob] = useState<Blob | null>(null)

  const station_data = useLoaderData()

  //console.log('station_data : ', station_data)

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  //console.log('[Station] edit_mode : ', edit_mode)

  const {
    control,
    formState: {
      errors,
      isDirty,
      defaultValues,
      isSubmitting,
    },
    handleSubmit,
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: station_data?.name,
    }
  })

  //console.log("errors.name : ", errors.name)

  const onSubmit = useCallback(async (data: any) => {
    console.log('submit : ', data)

    const body = new FormData()

    Object.keys(data).forEach(k => body.set(k, data[k]))

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


    actions.app.FormActionsState_state('read')


  }, [photo_blob, photo_data_url])

  //todo add prompt to reset and save form if fields changed
  useFormState({
    reset,
  }, isSubmitting)

  return (
    <div
      className=" w-full overflow-y-auto page user_profile_page flex-grow-1 flex flex-column text-800 md:py-4 py-3 md:px-4 px-3"
    >

      <div className="flex flex-column sm:flex-row">

        <div
          style={{ backgroundImage: `url(${photo_data_url || `/api/v1/files/station/avatar/${station_data.id}`})` }}

          className={`profile_picture shadow-2 select-none w-6rem h-6rem md:w-8rem md:h-8rem border-circle flex align-items-center justify-content-center p-ripple bg-no-repeat bg-contain bg-center ${edit_mode ? 'cursor-pointer' : ''}`}

          onClick={() => {
            if (edit_mode) {
              photo_file_input_ref.current?.click()
            }
          }}
        >
          <img
            style={{ display: 'none' }}
            src={`/api/v1/files/station/avatar/${station_data.id}`}

            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              set_profile_photo_exists(false)
            }}
          />

          {
            photo_data_url || profile_photo_exists ? <></> :
              <i className="pi pi-wave-pulse text-4xl md:text-6xl"></i>
          }

          {
            edit_mode ?
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
                actions.app.user_photo_data_url(data_url)
              }
            }}
          />

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-1 align-self-start sm:ml-5 mt-3 sm:mt-1 w-25rem max-w-full" ref={setForm}>

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

                <small className="p-error">{errors[field.name]?.message ?? ' '}</small>
              </>
            )}
          />




        </form>

      </div>

    </div>
  )
}