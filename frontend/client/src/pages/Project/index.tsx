import { FC, useCallback, useEffect, useMemo } from "react"

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

export const Project = () => {

  const navigate = useNavigate()

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const project = useLoaderData()
  console.log('project : ', project)

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
      name: '',
    }
  })

  console.log(errors.name)

  const onSubmit = (data) => {
    console.log('submit : ', data)
  };

  const save_disabled = useMemo(() => {
    return project ?
      //existing project /*new_value == old_value */
      false
      : //new project
      Boolean(
        isDirty ? errors.name : true
      )
  }, [isDirty, errors])

  return (
    <div
      className="sm:py-3 py-4 sm:px-3 px-4 w-full overflow-y-auto page project_page flex-grow-1 flex"
    >

      <div className="buttons mt-8 pt-2 flex flex-column gap-3">

        <Button
          icon="pi pi-check"
          rounded
          raised
          aria-label="Accept"
          className={`align-self-center p-0 ml-2 ${save_disabled ? 'bg-bluegray-300' : ''}`}
          severity={`success`}
          disabled={save_disabled}

          onClick={handleSubmit(onSubmit)}
        />

        {
          project ?
            <Button
              icon="pi pi-trash"
              rounded
              text
              raised
              aria-label="Accept"
              className="align-self-center p-0 ml-2"
              severity='danger'

              onClick={() => { }}
            />
            : ''
        }
      </div>

      <div className="flex flex-column">

        <div
          className="breadcrumbs shadow-3 ml-5 flex align-items-center pl-3"
          style={{
            borderRadius: '24px',
            height: '3rem',
            lineHeight: '1rem',
          }}>
          Breadcrumbs
        </div>

        <div className="flex mt-3">

          <Button
            icon="pi pi-image"
            rounded
            text
            raised
            aria-label="Accept"
            className="p-0 ml-5 mt-4"
            onClick={() => {

            }}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2 align-self-start ml-5">
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Project name cannot be empty' }}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames(
                      { 'p-error': errors[field.name] },
                      'ml-2',
                      'pl-1',
                      'text-600'
                    )}
                  >
                    <small>Project</small>
                  </label>

                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({ 'p-invalid': fieldState.error })}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    disabled={false}
                    pt={{
                      root: {
                        onInput: (e) => {
                          //@ts-ignore
                          e.target.size = Math.min(Math.max(e.target.value.length - 7, 20), 70)
                        }
                      }
                    }}
                  />

                  <small className="p-error ml-2 pl-1">{errors[field.name]?.message ?? ' '}</small>
                </>
              )}
            />
          </form>

        </div>

      </div>

      <div className="shadow-3 flex-grow-1 h-full ml-5 mt-8 flex align-items-center justify-content-center">
        Editor
      </div>


    </div>
  )
}