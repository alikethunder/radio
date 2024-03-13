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
      className="sm:py-5 py-4 sm:px-6 px-4 w-full overflow-y-auto page project_page flex-grow-1 flex flex-column"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2 align-self-center">
        <Controller
          name="value"
          control={control}
          rules={{ required: 'Name - Surname is required.' }}
          render={({ field, fieldState }) => (
            <>
              <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
              <span className="p-float-label">

                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error }, 'text-center')}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={false}
                  oninput="this.size = this.value.length"
                  pt={{
                    root: {
                      oninput: function() {
                        console.log(this)
                      }
                    }
                  }}
                />

                <label htmlFor={field.name}>
                  Project
                </label>
              </span>

              <small className="p-error">{errors[name] ? errors[name].message : <>&nbsp;</>}</small>
            </>
          )}
        />

      </form>


    </div>
  )
}