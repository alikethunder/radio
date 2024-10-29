import { FC, useCallback, useEffect, useMemo, useRef, useState, } from "react"

import {
  generatePath,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom"

import {
  Controller,
  useForm,
  useWatch
} from 'react-hook-form'

import { useDebounceCallback } from 'usehooks-ts'

import { classNames } from 'primereact/utils'

import { Button } from 'primereact/button'

import { InputText } from "primereact/inputtext"

import { confirmDialog } from 'primereact/confirmdialog'

import { InputSwitch } from "primereact/inputswitch"

import { Tag } from 'primereact/tag'

import { Editor } from 'primereact/editor'

import { Chips } from 'primereact/chips'

import './index.sass'

import {
  actions,
  store,
  useStore,
} from "@/store"

import {
  resize_image,
} from "@/functions"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

import {
  app_routes,
} from '@/constants/router'

import { Ripple } from "primereact/ripple"

import {
  useFormState,
  useTranslations,
  useTranslationsSkeleton,
} from '@/hooks'

import { tooltip_options } from "@/constants/tooltip_options"

import {
  Station as StationType
} from "@/types"

import { setForm } from "@/functions/setForm"

import {
  AddStationToFavorites,
  StationTag,
} from '@/components'

import { random_station_tag_color } from "@/functions/random_station_tag_color"

import { StationTagRemoveTokenIcon } from "@/layout parts"

import { Helmet } from "react-helmet"
import { update_json } from "@/API/profile/update_json"

export const Station = () => {

  const station = useLoaderData() as StationType

  const [search, set_search] = useSearchParams()

  useEffect(() => {
    if (station.id == 'new') {
      set_search(s => {
        s.set('edit', '')
        return s
      }, { replace: true })
    }
  }, [station?.id])

  //console.log('station : ', station)

  const navigate = useNavigate()

  const photo_file_input_ref = useRef<HTMLInputElement>(null)

  const tracks_input_ref = useRef<HTMLInputElement>(null)

  const [profile_photo_exists, set_profile_photo_exists] = useState(true)

  const [avatar_data_url, set_avatar_data_url] = useState<string | null>(null)

  const [avatar_blob, set_avatar_blob] = useState<Blob | null>(null)

  const [tracks_to_upload, set_tracks_to_upload] = useState()

  const edit_mode = useStore().app.FormActionsState_edit_mode()

  const signedin = useStore().auth.signedin()

  const root_admin = useStore().user.admin()

  const current_user_id = useStore().user.id()

  const playing = useStore().player.playing()

  const current_station = useStore().player.current_station()

  const languages = useStore().persistedApp.languages()

  const language = useStore().persistedApp.language()

  const station_admin = useMemo(() => Boolean(
    signedin
    && current_user_id
    && station.admins?.includes(current_user_id)
  ), [
    station,
    signedin,
    current_user_id
  ])

  //console.log('[Station] is_admin : ', is_admin)

  const {
    control,
    formState,
    handleSubmit,
    getValues,
    setValue,
    reset,
    clearErrors,
    watch,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: station?.name ?? '',
      external_enable: station?.external_enable ?? false,
      external: station?.external ?? '',
      broadcasting: station?.broadcasting ?? false,
      tags: station?.tags ?? [],
      ...Object.fromEntries(languages.map(language => ([`description_${language}`, station[`description_${language}`] ?? '']))),
      ...Object.fromEntries(languages.map(language => ([`text_description_${language}`, station[`text_description_${language}`] ?? ''])))
    }
  })

  const { errors } = formState

  //console.log("errors.name : ", errors.name)

  const onSubmit = useCallback(async (data: any) => {
    console.log('submit : ', data)

    const { id } = station

    const resp = await fetch(`/api/v1/radio/update/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (resp.status == 200) {

      //*! update station in list

      if (id != 'new') {
        //console.log('station before : ', JSON.stringify(station.tags))

        Object.entries(data).map(entry => {
          //@ts-ignore
          station[entry[0]] = entry[1]
        })

        //console.log('station after : ', JSON.stringify(station.tags))

        if (store.player.current_station()?.id === id) {
          //console.log('current station before : ', JSON.stringify(store.player.current_station()?.tags))

          actions.player.current_station(station)

          //console.log('current station after : ', JSON.stringify(store.player.current_station()?.tags))
        }
        // *! update current station if it's this station 
        //actions.player.current_station()
      }

      if (avatar_blob) {

        const body = new FormData()

        body.set('avatar', avatar_blob)

        const resp = await fetch(`/api/v1/files/stations/${id}/avatar`, {
          method: 'POST',
          body,
        })

        if (resp.status != 200) {
          console.log(`[Station] avatar upload error : `, resp)
        } else {
          set_avatar_blob(null)
        }

      }

      if (id == 'new') {
        const id = await resp.text()
        navigate(generatePath(app_routes["station$id"], { id }))
      }

    } else {
      console.log(`[Station] update error : `, resp)
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
      store.persistedApp.languages().forEach(language => {
        //@ts-ignore
        setValue(`description_${language}`, station[`description_${language}`])
        //@ts-ignore
        setValue(`text_description_${language}`, station[`text_description_${language}`])
      })

      reset()
    },
  }, formState, root_admin || station_admin)

  const external = useWatch({
    control,
    name: 'external'
  })

  useEffect(() => {
    if (!external) {
      setValue("external_enable", false)
    }
  }, [external])

  const change_station_tags = useDebounceCallback(async (e, field) => {
    field.onChange(e)

    //console.log(e.value)

    const new_tags = (e.value as string[])?.filter(name => !store.app.get_station_tag(name)).map(name => ({
      name,
      color: random_station_tag_color()
    }))

    if (new_tags?.length) {
      //console.log('new_tags : ', new_tags)

      const resp = await fetch('/api/v1/tags/', {
        method: 'POST',
        body: JSON.stringify(new_tags)
      })

      const json = await resp.json()

      actions.app.update_tags(json)
    }
  }, 50)

  const [translations] = useTranslations([
    'play',
    'pause',
    'sitename',
    'add_to_favorites',
  ], true)

  const translations_skl = useTranslationsSkeleton({
    "choose_image": ["w-4rem"],
    "radiostation": ['w-8rem'],
    "error_radiostation_name_empty": ["w-8rem"],
  }, true)

  return (
    <>
      <Helmet>
        <title>{translations.sitename} - {station.name}</title>

        <meta property="og:type" content="music.radio_station" />

        <meta name="twitter:card" content="summary" />

        {
          language ? <meta property="og:locale" content={language} /> : <></>
        }

        <meta property="og:locale:alternate" content={languages.join(',').replaceAll(`${language},`, '').replaceAll(language ?? '', '')} />

        <meta property="og:site_name" content={translations.sitename} />

        <meta property="og:title" content={`${translations.sitename} - ${station.name}`} />
        <meta name="twitter:title" content={`${translations.sitename} - ${station.name}`} />

        <meta name="description" content={`${station[`text_description_${language}`]}`} />
        <meta property="og:description" content={`${station[`text_description_${language}`]}`} />
        <meta property="twitter:description" content={`${station[`text_description_${language}`]}`} />

        <link rel="canonical" href={`${window.location.origin}${generatePath(app_routes["station$id"], { id: station.id })}?language=${language}`} />

        <meta property="og:url" content={`${window.location.origin}${generatePath(app_routes["station$id"], { id: station.id })}?language=${language}`} />

        <meta property="twitter:url"
          content={`${window.location.origin}${generatePath(app_routes["station$id"], { id: station.id })}?language=${language}`} />

        <meta property="og:image" content={`${window.location.origin}/api/v1/files/stations/${station.id}/avatar`} />
        <meta property="og:image:width" content="128" />
        <meta property="og:image:height" content="128" />
        <meta property="twitter:image" content={`${window.location.origin}/api/v1/files/stations/${station.id}/avatar`} />

        <meta property="twitter:domain" content={window.location.origin} />

      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Radiostation',
          name: station.name,
          description: station[`description_${language}`],
          availableLanguage: [
            {
              "@type": "Language",
              "name": "English"
            },
            {
              "@type": "Language",
              "name": "Russian"
            }
          ],
          keywords: station.tags.join(','),
          logo: `${window.location.origin}/api/v1/files/stations/${station.id}/avatar`,
          url: `${window.location.origin}${generatePath(app_routes["station$id"], { id: station.id })}?language=${language}`,
        })}
      </script>

      <div
        className=" w-full overflow-y-auto page station_page flex-grow-1 flex flex-column text-800 md:p-4 md:px-5 p-3"
      >
        {/* background here? */}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3 align-self-start max-w-full" ref={setForm}>

          <Controller
            name="name"
            control={control}
            rules={{
              required: {
                value: true,
                message: translations_skl.error_radiostation_name_empty,
              }
            }}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className={classNames(
                    {
                      'p-error': errors[field.name]
                    },
                    'text-600',
                    "select-none",
                    'flex',
                    'align-items-center'
                  )}
                >
                  <small>{translations_skl.radiostation}</small>

                  {
                    edit_mode ?
                      <Controller
                        name="broadcasting"
                        control={control}
                        render={({ field: switch_field, }) => (
                          <>
                            <InputSwitch
                              inputId={switch_field.name}
                              checked={switch_field.value}
                              inputRef={switch_field.ref}
                              className="origin-center"
                              onChange={switch_field.onChange}
                              disabled={!external}
                              pt={{
                                root: {
                                  style: {
                                    transform: 'scale(0.6)'
                                  },
                                  className: classNames({

                                  })
                                }
                              }}
                            />

                            <label htmlFor={switch_field.name} className="cursor-pointer ml-0">
                              <Tag
                                value={switch_field.value ? 'on' : 'off'}
                                severity={switch_field.value ? 'success' : null}
                                pt={{
                                  root: {
                                    className: classNames({
                                      'surface-300': !switch_field.value
                                    },
                                      'py-05',
                                      'shadow-2',
                                    ),
                                  },
                                  value: {
                                    style: {
                                      lineHeight: 1.25,
                                    }
                                  }
                                }}
                              />
                            </label>
                          </>
                        )}
                      />
                      : <></>
                  }
                </label>

                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames(
                    {
                      'p-invalid': fieldState.error,
                    },
                    'max-w-full',
                    'align-self-start',
                    'shadow-2',
                    'w-20rem'
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

                {
                  edit_mode ?
                    <small className="p-error">{errors[field.name]?.message ?? ' '}</small>
                    : <></>
                }
              </>
            )}
          />

          <div className="flex flex-row gap-3">

            <div
              style={{ backgroundImage: `url(${avatar_data_url || `/api/v1/files/stations/${station.id}/avatar`})` }}

              className={`element_with_overlay shadow-2 select-none w-6rem h-6rem md:w-8rem md:h-8rem border-round-xl flex flex-shrink-0 align-items-center justify-content-center p-ripple bg-no-repeat bg-contain bg-center ${edit_mode ? 'cursor-pointer' : ''}`}

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
                        {translations_skl.choose_image}
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

            <Button
              className="shadow_on_hover p-0 flex-shrink-0 w-4rem md:w-5rem h-4rem md:h-5rem"

              rounded
              outlined
              raised
              aria-label={`${playing && current_station?.id == station.id ? translations.pause : translations.play}`}
              severity="info"
              icon={`pi text-4xl ${playing && current_station?.id == station.id ? 'pi-pause' : 'pi-play'}`}

              pt={{
                icon: {
                  style: {
                    paddingLeft: playing && current_station?.id == station.id ? '0' : '4px',
                  }
                }
              }}

              onClick={() => {
                if (store.player.playing() && store.player.current_station()?.id == station.id) {
                  actions.player.playing(false)
                } else {
                  actions.player.playing(true)
                  actions.player.current_station(station)
                }
              }}
            />

            <div className="flex flex-column">
              <AddStationToFavorites id={station.id} />
            </div>
          </div>

          {
            edit_mode ?
              <Controller
                name="tags"
                control={control}
                render={({ field, }) => (
                  <>

                    <label
                      htmlFor={field.name}
                      className={classNames(
                        {
                          'p-error': errors[field.name]
                        },
                        'text-600',
                        "select-none",
                        'flex',
                        'align-items-center'
                      )}
                    >
                      <small>Tags</small>
                    </label>

                    <Chips
                      value={field.value}
                      onChange={e => change_station_tags(e, field)}
                      allowDuplicate={false}
                      removable

                      removeIcon={<StationTagRemoveTokenIcon onClick={e => {
                        if (e) {
                          setValue(field.name, field.value.filter(v => v != (e.target as HTMLElement).closest('.p-chips-token')?.querySelector('.p-tag-value')?.textContent))
                        }
                      }} />}

                      pt={{
                        token: {
                          className: classNames({

                          },
                            'p-0',
                            'ml-1',
                            'bg-red-600',
                            'border-round',
                          ),
                        },
                      }}

                      itemTemplate={tag => <StationTag tag={tag} disable_link />}
                    />
                  </>
                )} />
              :
              <div className="flex flex-row flex-wrap gap-2">
                {
                  station?.tags?.map(tag => <StationTag tag={tag} />)
                }
              </div>
          }

          {/* Read only editor */}
          <Editor
            value={station[`description_${language}`]}
            readOnly
            headerTemplate={<></>}
            pt={{
              toolbar: {
                style: {
                  display: 'none'
                }
              },
              content: {
                className: classNames({},
                  'mt-2',
                  'shadow-2',
                ),
                style: {
                  maxHeight: '240px',
                  border: '1px solid #dfe7ef',
                  overflowY: 'auto',
                  borderRadius: '6px',
                  padding: '1px',
                  ...edit_mode || !station[`description_${language}`] ? {
                    display: 'none',
                  } : {},
                },
              }
            }}
          />

          {/* Edit only editor */}
          {
            languages.map(language =>
              <>
                <Editor
                  value={station[`description_${language}`]}
                  style={{
                    maxHeight: '240px',
                    overflowY: 'auto',
                  }}

                  formats={['bold', 'font', 'italic', 'link', 'size', 'underline', 'list', '']}

                  headerTemplate={
                    <>
                      <span className="bg-primary select-none p-2">
                        {language}
                      </span>

                      <span className={`ql-formats`} >

                        <select className="ql-size">

                          <option selected></option>
                          <option value="large"></option>
                          <option value="huge"></option>
                        </select>

                      </span>

                      <span className={`ql-formats`} >

                        <button className="ql-bold" aria-label="Bold"></button>

                        <button className="ql-italic" aria-label="Italic"></button>

                        <button className="ql-underline" aria-label="Underline"></button>

                      </span>

                      <span className={`ql-formats`} >

                        <button className="ql-list" value={'ordered'} aria-label="Ordered List"></button>

                        <button className="ql-list" value={'bullet'} aria-label="Unordered List"></button>

                      </span>

                      <span className={`ql-formats`} >

                        <button className="ql-link" aria-label="Link"></button>

                      </span>
                    </>
                  }

                  pt={{
                    root: {
                      className: classNames({},
                        'shadow-2',
                        'mt-2',
                      ),
                      style: {
                        ...edit_mode ? {} : {
                          display: 'none'
                        },
                      }
                    }
                  }}

                  onTextChange={e => {
                    //console.log('description ', language, ' : ', e.htmlValue)
                    //@ts-ignore
                    setValue(`description_${language}`, e.htmlValue ?? '')
                    //@ts-ignore
                    setValue(`text_description_${language}`, (e.textValue ?? '').replaceAll(/\r?\n|\r/g, ''))
                  }}
                />
              </>
            )
          }

          {
            edit_mode ?
              <div className="flex flex-column gap-1">
                <Controller
                  name="external"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className='text-600 select-none flex align-items-center'
                      >
                        <small>External</small>

                        <Controller
                          name="external_enable"
                          control={control}
                          render={({ field: switch_field, }) => (
                            <>
                              <InputSwitch
                                inputId={switch_field.name}
                                checked={switch_field.value}
                                inputRef={switch_field.ref}
                                className="origin-center"
                                onChange={switch_field.onChange}
                                disabled={!external}
                                pt={{
                                  root: {
                                    style: {
                                      transform: 'scale(0.6)'
                                    },
                                    className: classNames({

                                    })
                                  }
                                }}
                              />

                              <label htmlFor={switch_field.name} className="cursor-pointer ml-0">
                                <Tag
                                  value={switch_field.value ? 'on' : 'off'}
                                  severity={switch_field.value ? 'success' : null}
                                  pt={{
                                    root: {
                                      className: classNames({
                                        'surface-300': !switch_field.value
                                      },
                                        'py-05',
                                      ),
                                    },
                                    value: {
                                      style: {
                                        lineHeight: 1.25,
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </>
                          )}
                        />

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
              </div>
              : <></>
          }

        </form>

        {
          edit_mode && false ?
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
    </>
  )
}