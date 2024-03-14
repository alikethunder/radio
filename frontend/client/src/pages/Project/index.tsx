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

  const defaultValues = {
    value: ''
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset
  } = useForm({ defaultValues })


  const onSubmit = (data) => {
    console.log('submit : ', data)
  };

  return (
    <div
      className="sm:py-3 py-4 sm:px-6 px-4 w-full overflow-y-auto page project_page flex-grow-1 flex flex-column"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2 align-self-start ml-7">
        <Controller
          name="value"
          control={control}
          rules={{ required: 'Name - Surname is required.' }}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames(
                  { 'p-error': errors.value },
                  //'flex',
                  //'align-items-end',
                )}
              >
                <small>Project</small>

                <Button
                  icon="pi pi-check"
                  rounded
                  text
                  raised
                  aria-label="Accept"
                  className="align-self-center p-0 ml-2"
                  severity="success"
                  disabled
                  pt={{
                    root: {
                      style: {
                        height: '1.2rem',
                        width: '1.2rem',
                      }
                    },
                    icon: {
                      style: {
                        fontSize: '.7rem',
                      }
                    }
                  }}
                />
              </label>

              <InputText
                id={field.name}
                value={field.value}
                className={classNames({ 'p-invalid': fieldState.error })}
                onChange={(e) => field.onChange(e.target.value)}
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

              <small className="p-error">{errors[name] ? errors[name].message : <>&nbsp;</>}</small>
            </>
          )}
        />

      </form>


    </div>
  )
}