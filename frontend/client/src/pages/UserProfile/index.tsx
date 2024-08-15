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

const navbar_actions_tooltip_options = { showDelay: 300, hideDelay: 200, position: 'bottom' } as const

export const UserProfile = () => {

  const navigate = useNavigate()

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const user_data = useLoaderData()

  console.log('user_data : ', user_data)

  const [edit_mode, set_edit_mode] = useState<'read' | 'edit' | 'saving'>('read')

  const {
    control,
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: user_data?.name,
    }
  })

  //console.log("errors.name : ", errors.name)

  const onSubmit = (data) => {
    console.log('submit : ', data)
  };

  const save_disabled = useMemo(() => {
    return user_data ?
      //existing project /*new_value == old_value */
      false
      : //new project
      Boolean(
        isDirty ? errors.name : true
      )
  }, [isDirty, errors])

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
          tooltipOptions={navbar_actions_tooltip_options}
          className={`p-0 w-2rem h-2rem ${save_disabled ? 'bg-bluegray-300' : ''} shadow_on_hover focus:shadow-none`}
          severity={`warning`}
          disabled={save_disabled}

          onClick={() => set_edit_mode('edit')}
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
            tooltipOptions={navbar_actions_tooltip_options}
            className={`p-0 w-2rem h-2rem ${save_disabled ? 'bg-bluegray-300' : ''} shadow_on_hover focus:shadow-none`}
            severity={`success`}
            size="small"
            disabled={save_disabled}

            onClick={handleSubmit(onSubmit)}
          />

          <Button
            icon="pi pi-times"
            rounded
            outlined
            raised
            aria-label="Отменить"
            tooltip="Отменить"
            tooltipOptions={navbar_actions_tooltip_options}
            className="p-0 w-2rem h-2rem shadow_on_hover focus:shadow-none"
            severity='danger'
            size="small"

            onClick={() => set_edit_mode('read')}
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
          tooltipOptions={navbar_actions_tooltip_options}
          className="p-0 w-2rem h-2rem cursor-wait focus:shadow-none"
          severity='help'
        />
        break;

      default: return null
    }
  }, [edit_mode])

  useEffect(() => {
    actions.app.navbar_actions(
      <div className="buttons flex flex-row gap-2 align-items-center pl-2">
        {navbar_actions}
      </div>
    )

    return () => actions.app.navbar_actions(null)
  }, [navbar_actions])

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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2 align-self-start sm:ml-5 mt-3 sm:mt-1">

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
                  disabled={edit_mode == 'read'}
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