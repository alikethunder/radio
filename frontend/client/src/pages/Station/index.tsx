import { FC, useCallback, useEffect, useMemo, useRef, useState, LegacyRef } from "react"

import {
  generatePath,
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

import { InputSwitch } from "primereact/inputswitch"

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
} from '@/hooks'

import { tooltip_options } from "@/constants/tooltip_options"

import {
  Station as StationType
} from "@/types"

import { setForm } from "@/functions/setForm"

import { useAsyncMemo } from "use-async-memo"

import { admin } from "@/API/profile/admin"

const private_tooltip_options = { ...tooltip_options, position: 'right' } as const

export const Station = () => {

  const station = useLoaderData() as StationType

  //console.log('station : ', station)

  const navigate = useNavigate()

  const windowSize = useTrackedStore().app.windowSize()
  const isDesktop = useTrackedStore().app.isDesktop()

  const photo_file_input_ref = useRef<HTMLInputElement>(null)

  const tracks_input_ref = useRef<HTMLInputElement>(null)

  const [profile_photo_exists, set_profile_photo_exists] = useState(true)

  const [avatar_data_url, set_avatar_data_url] = useState<string | null>(null)

  const [avatar_blob, set_avatar_blob] = useState<Blob | null>(null)

  const [tracks_to_upload, set_tracks_to_upload] = useState()

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const [is_admin, set_is_admin] = useState(false)

  const signedin = useStore().auth.signedin()

  const root_admin = useStore().user.admin()

  useEffect(() => {
    //console.log('signedin, root_admin: ', signedin, root_admin)

    if (signedin) {
      if (root_admin) {
        set_is_admin(true)
      } else {
        admin(station.id).then(r => {
          //parameters can change during call, so they're requested again from store
          set_is_admin(store.auth.signedin() && (r || store.user.admin()))
        })
      }
    } else {
      set_is_admin(false)
    }
  }, [station, signedin, root_admin])

  //console.log('[Station] is_admin : ', is_admin)

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
      name: station?.name ?? '',
      external_enable: station?.external_enable ?? false,
      external: station?.external ?? '',
    }
  })

  const { errors } = formState

  //console.log("errors.name : ", errors.name)

  const onSubmit = useCallback(async (data: any) => {
    console.log('submit : ', data)

    const body = new FormData()

    Object.keys(data).forEach(k => body.set(k, data[k]))

    if (avatar_blob) {
      body.set('avatar', avatar_blob)
    }

    if (station.id != 'new') {
      body.set('id', station.id)
    }

    //console.log('id : ', station.id)

    const resp = await fetch('/api/v1/radio/update', {
      method: 'POST',
      body,
    })

    if (resp.status == 200) {
      const id = await resp.text()
      navigate(generatePath(app_routes["station$id"], { id }))
      set_avatar_blob(null)
    } else {

    }



  }, [avatar_blob, avatar_data_url, station])

  const file_reader = new FileReader()

  const get_track_duration = useCallback(async (file: File) => {

    file_reader.readAsArrayBuffer(file)

    return await new Promise((res, rej) => {
      file_reader.onloadend = (e) => {
        const ctx = new AudioContext()

        const audioArrayBuffer = e.target?.result as ArrayBuffer

        ctx.decodeAudioData(audioArrayBuffer, data => {
          //success
          const duration = data.duration

          //console.log('Audio file duration: ', duration, duration.toFixed(3))

          res(duration.toFixed(3))
        }, er => {
          //error
          console.error("[Station] get_track_duration something wrong with file: ", er)
          rej(er)
        })

      }
    })
  }, [])

  const get_track_metadata = async (file: File) => {

    return await new Promise((res, rej) => {
      window.jsmediatags.read(file, {
        onSuccess(tag: any) {
          console.log("[Station] onSuccess get_track_metadata : ", tag)
          res(tag)
        },
        onError(er: Error) {
          console.log("[Station] onError get_track_metadata : ", er)
          rej(er)
        }
      })
    })
  }

  const addTracks = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[Station] addTracks : ', e.target.files)

    if (e.target.files?.length) {
      for (const file of e.target.files) {
        const duration = await get_track_duration(e.target.files[0])

        console.log('duration : ', duration)

        const metadata = await get_track_metadata(file) as any

        const blob = metadata.picture

        console.log('metadata : ', metadata)

        //*get track data, image, name, artist, size

      }




      /* const [blob, data_url] = await resize_image(e.target.files?.[0])
      set_avatar_blob(blob)
      set_avatar_data_url(data_url) */
    }
  }

  //todo add prompt to reset and save form if fields changed
  useFormState({
    reset() {
      set_avatar_data_url(null)
      set_avatar_blob(null)
      reset()
    },
  }, formState, is_admin)

  return (
    /* background here */
    <div
      className=" w-full overflow-y-auto page user_profile_page flex-grow-1 flex flex-column text-800 md:py-4 py-3 md:px-4 px-3"
    >

      <div className="flex flex-column sm:flex-row">

        <div
          style={{ backgroundImage: `url(${avatar_data_url || `/api/v1/files/stations/${station.id}/avatar`})` }}

          className={`profile_picture shadow-2 select-none w-6rem h-6rem md:w-8rem md:h-8rem border-circle flex align-items-center justify-content-center p-ripple bg-no-repeat bg-contain bg-center ${edit_mode ? 'cursor-pointer' : ''}`}

          onClick={(e: React.MouseEvent) => {
            if (edit_mode) {
              photo_file_input_ref.current?.click()
            }
          }}
        >
          <img
            style={{ display: 'none' }}
            src={`/api/v1/files/stations/${station.id}/avatar`}

            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              set_profile_photo_exists(false)
            }}
          />

          {
            avatar_data_url || profile_photo_exists ? <></> :
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
                set_avatar_blob(blob)
                set_avatar_data_url(data_url)
              }
            }}
          />

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-1 align-self-start sm:ml-5 mt-3 sm:mt-1 w-25rem max-w-full" ref={setForm}>

          <Controller
            name="name"
            control={control}
            rules={{ required: 'Radiostation name cannot be empty' }}
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
                  <small>Radiostation</small>
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

          {
            edit_mode ?
              <div className="external_container flex flex-row align-items-center">
                {/* input field for link */}
                <Controller
                  name="external"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames(
                          'text-600'
                        )}
                      >
                        <small>External source</small>
                      </label>

                      <InputText
                        id={field.name}
                        value={field.value}
                        className={classNames(
                          {
                          },
                        )}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </>
                  )}
                />


                {/* broadcasting switch */}
                <Controller
                  name="external_enable"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputSwitch
                        inputId={field.name}
                        checked={field.value}
                        inputRef={field.ref}
                        className="mr-2"
                        onChange={(e) => {
                          field.onChange(e.checked)
                        }} />
                      <label htmlFor={field.name} className="cursor-pointer">Use external source</label>
                    </>
                  )}
                />


              </div>
              : <></>
          }

        </form>

      </div>


      {
        edit_mode ?
          <>

            {/* Upload tracks */}

            <Button className="track_uploader" label="Upload tracks" onClick={e => {
              if (edit_mode) {
                tracks_input_ref.current?.click()
              }
            }}>

              <input
                ref={tracks_input_ref}
                type="file"
                id="tracks_input"
                className="hidden"
                multiple
                onChange={addTracks}
              />
            </Button>

            {/* Playlist */}
            < DataTable value={[]} sortField="order" sortOrder={1} stripedRows>

              <Column field="order" header="Order" sortable ></Column>

              <Column field="image" header="Image" ></Column>

              <Column field="track" header="Track" sortable ></Column>

              <Column field="artist" header="artist" sortable ></Column>

              <Column field="track_time" header="Track time" sortable></Column>

              <Column field="time_to_play" header="Time to play (local PC time)"></Column>

              <Column field="downloads" header="Downloads" sortable></Column>

              <Column field="likes" header="Likes" sortable></Column>
            </DataTable>
          </>
          : <></>
      }

    </div >
  )
}