import { FC, useCallback, useEffect, useMemo, useRef, useState, } from "react"

import {
  generatePath,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom"

import { useClickOutside } from 'primereact/hooks'

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
import { tag_text_class } from '@/constants/classes'

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
  useMobile,
  useTranslations,
  useTranslationsSkeleton,
} from '@/hooks'

import {
  StationGenre,
  Station as StationType
} from "@/types"

import { setForm } from "@/functions/setForm"

import {
  AddStationToFavorites,
  StationCountryTag,
  StationGenreTag,
  StationLanguageTag,
  StationTag,
  StationShareButton,
  YandexAd,
} from '@/components'

import { random_station_tag_color } from "@/functions/random_station_tag_color"

import { GenreItemTemplate, StationTagRemoveTokenIcon } from "@/layout parts"

import { Helmet } from "react-helmet"
import { update } from "@/API/station/update_json"
import { MultiSelect } from "primereact/multiselect"

import { multiselect_pt } from "@/constants/multiselect"

export const Station = () => {

  const station = useLoaderData() as StationType

  const mobile = useMobile()

  const [search, set_search] = useSearchParams()

  const theme = useStore().persistedApp.theme()

  const tags_suggestions_ref = useRef(null)

  const tags_input_ref = useRef<Chips | null>(null)

  useClickOutside(tags_suggestions_ref, () => {
    set_tags_suggestion_focused(false)
  })

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

  const tracks_input_ref = useRef<HTMLInputElement>(null)

  const [tags_suggestion_focused, set_tags_suggestion_focused] = useState(false)

  const [tags_suggestion_text, set_tags_suggestion_text] = useState('')

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

  const languages = useStore().translations.languages()

  const language = useStore().translations.language()

  const station_genres = useStore().session.station_genres()

  const station_languages = useStore().session.station_languages()

  const stations_tags = useStore().session.station_tags()

  const [image_loading, set_image_loading] = useState(true)

  const [station_avatar, set_station_avatar] = useState<string>(`/api/v1/files/stations/${station?.id}/avatar`)

  useEffect(() => {
    set_station_avatar(`/api/v1/files/stations/${station?.id}/avatar`)
  }, [station?.id])

  const station_admin = useMemo(() => Boolean(
    signedin
    && current_user_id
    && station.admins?.includes(current_user_id)
  ), [
    station,
    signedin,
    current_user_id
  ])

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
      genres: station_genres.filter(g => (station?.genres ?? []).includes(g.en)),
      languages: station_languages.filter(l => (station?.languages ?? []).includes(l.en)),
      tags: station?.tags ?? [],
      ...Object.fromEntries(languages.map(language => ([`description_${language}`, station[`description_${language}`] ?? '']))),
    }
  })

  const { errors } = formState

  //console.log("errors.name : ", errors.name)

  const onSubmit = useCallback(useDebounceCallback(async (data: any) => {

    data.genres = data.genres.map((g: StationGenre) => g.en)
    data.languages = data.languages.map((l: StationGenre) => l.en)

    console.log('submit : ', data)

    const { id } = station

    const resp = await update(id, data)

    if (resp.status == 200) {

      //*! update station in list

      if (id != 'new') {
        Object.entries(data).map(entry => {
          //@ts-ignore
          station[entry[0]] = entry[1]
        })

        if (store.player.current_station()?.id === id) {
          actions.player.current_station(station)
        }
      }

      if (avatar_blob) {

        const body = new FormData()

        body.set('avatar', avatar_blob)

        const resp = await fetch(`${window.location.origin}/api/v1/files/stations/${id}/avatar`, {
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
        console.log('[Station new] navigate')

        navigate(generatePath(app_routes["station$id"], { id }))
      }

    } else {
      console.log(`[Station] update error : `, resp)
    }

  }, 50), [avatar_blob, avatar_data_url, station])

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
      store.translations.languages().forEach(language => {
        //@ts-ignore
        setValue(`description_${language}`, station[`description_${language}`])
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
    console.log(field.value)
    e.target.value = e.value = e.value?.map((tag: string) => tag?.trim())

    console.log('change_station_tags after trim : ', e.value)

    field.onChange(e)

    //console.log(e.value)

    const new_tags = (e.value as string[])?.filter(name => !store.session.get_station_tag(name)).map(name => ({
      name,
      color: random_station_tag_color()
    }))

    if (new_tags?.length) {
      //console.log('new_tags : ', new_tags)

      const resp = await fetch(`${window.location.origin}/api/v1/tags/`, {
        method: 'POST',
        body: JSON.stringify(new_tags)
      })

      const json = await resp.json()

      actions.session.update_tags(json)
    }
  }, 50)

  const [translations] = useTranslations([
    'play',
    'pause',
    'sitename',
    'add_to_favorites',
    'tags',
    'genre',
    "language",
  ], true)

  const translations_skl = useTranslationsSkeleton({
    "choose_image": ["w-4rem"],
    "radiostation": ['w-8rem'],
    "error_radiostation_name_empty": ["w-8rem"],
  }, true)

  const click_station_tag_remove = useDebounceCallback((e, field) => {
    if (e) {
      setValue(field.name, field.value.filter((v: string) => v != (e.target as HTMLElement).closest('.p-chips-token')?.querySelector('.value')?.textContent))
    }
  }, 50)

  const click_play = useDebounceCallback(() => {
    if (store.player.playing() && store.player.current_station()?.id == station.id) {
      actions.player.playing(false)
    } else {
      actions.player.playing(true)
      actions.player.current_station(station)
    }
  }, 50)

  const filtered_tags_suggestions = useMemo(() =>
    stations_tags?.filter(tag => tag.name.toLowerCase().includes(tags_suggestion_text.toLowerCase())).map(tag =>
      <StationTag key={tag.name} tag={tag.name} disable_link onClick={(e) => {
        e?.preventDefault()
        set_tags_suggestion_text('')
        if (tags_input_ref.current) {
          tags_input_ref.current.getInput().value = ''
          tags_input_ref.current.focus()
        }
        setValue('tags', [...(getValues('tags') ?? []), tag.name])
      }} />), [
    stations_tags,
    tags_suggestion_text,
  ])

  return (
    <>
      <Helmet>
        <title>{translations.sitename} - {station?.name}</title>

        <meta property="og:type" content="music.radio_station" />

        <meta name="twitter:card" content="summary" />

        {
          language ? <meta property="og:locale" content={language} /> : <></>
        }

        <meta property="og:locale:alternate" content={languages.join(',').replace(`${language},`, '').replace(language ?? '', '')} />

        <meta property="og:site_name" content={translations.sitename} />

        <meta property="og:title" content={`${translations.sitename} - ${station?.name}`} />
        <meta name="twitter:title" content={`${translations.sitename} - ${station?.name}`} />

        <meta name="description" content={`${station?.[`description_${language}`]}`} />
        <meta property="og:description" content={`${station?.[`description_${language}`]}`} />
        <meta property="twitter:description" content={`${station?.[`description_${language}`]}`} />

        <link rel="canonical" href={`${window.location.origin}${generatePath(app_routes["station$id"], { id: station?.id })}?language=${language}`} />

        <meta property="og:url" content={`${window.location.origin}${generatePath(app_routes["station$id"], { id: station?.id })}?language=${language}`} />

        <meta property="twitter:url"
          content={`${window.location.origin}${generatePath(app_routes["station$id"], { id: station?.id })}?language=${language}`} />

        <meta property="og:image" content={`${window.location.origin}/api/v1/files/stations/${station?.id}/avatar`} />
        <meta property="og:image:width" content="128" />
        <meta property="og:image:height" content="128" />
        <meta property="twitter:image" content={`${window.location.origin}/api/v1/files/stations/${station?.id}/avatar`} />

        <meta property="twitter:domain" content={window.location.origin} />

      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Radiostation',
          name: station?.name,
          description: station?.[`description_${language}`],
          keywords: station.tags?.join(','),
          logo: `${window.location.origin}/api/v1/files/stations/${station.id}/avatar`,
          url: `${window.location.origin}${generatePath(app_routes["station$id"], { id: station?.id })}?language=${language}`,
        })}
      </script>

      <div
        className=" w-full overflow-y-auto page station_page flex-grow-1 flex flex-column text-800 md:p-4 md:pl-5 p-3 md:pr-0"
      >
        {/* background here? */}

        <div className="flex flex-row gap-2 flex-grow-1">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3 align-self-start max-w-full flex-shrink-0" ref={setForm}>

            <div className="flex flex-row gap-3">

              <div
                style={{ backgroundImage: `url(${avatar_data_url || station_avatar})` }}

                className={`element_with_overlay shadow-2 select-none w-6rem h-6rem md:w-8rem md:h-8rem border-round-xl flex flex-shrink-0 align-items-center justify-content-center p-ripple bg-no-repeat bg-contain bg-center ${edit_mode ? 'cursor-pointer' : ''}`}
              >
                <img
                  style={{ display: 'none' }}
                  src={station_avatar}

                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    set_profile_photo_exists(false)
                    set_station_avatar('/radio.png')
                  }}

                  onLoad={(e) => {
                    set_image_loading(false)
                  }}

                  loading="lazy"
                />

                {
                  image_loading ?
                    <i className="pi pi-spin pi-spinner text-400" style={{ fontSize: '2rem' }}></i>
                    : <></>
                }

                {
                  edit_mode ?
                    <>

                      <label htmlFor="fileElem" className="overlay absolute top-0 bottom-0 right-0 left-0 m-0 flex align-items-center justify-content-center text-center">

                        <div className="overlay_background surface-900 absolute top-0 bottom-0 right-0 left-0"></div>

                        <div className="overlay_text text-white font-semibold z-1">
                          {translations_skl.choose_image}
                        </div>

                      </label>

                      <Ripple />

                    </>
                    : <></>
                }

                <input
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

              <div className="flex flex-column gap-2">
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
                    edit_mode ?
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
                            'w-20rem',
                            'action_text_font',
                            'text-xl',
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
                      :
                      <span className="font-bold text-base sm:text-xl select-none">
                        {
                          station?.name
                        }
                      </span>
                  )}
                />

                <StationCountryTag en={station?.country} />

              </div>

            </div>

            <div className="flex flex-row gap-3 align-items-center">
              <Button
                className="shadow_on_hover p-0 flex-shrink-0 w-4rem md:w-5rem h-4rem md:h-5rem"

                rounded
                outlined
                raised
                aria-label={`${playing && current_station?.id == station.id ? translations.pause : translations.play}`}
                severity="info"
                icon={`pi text-4xl ${playing && current_station?.id == station.id ? 'pi-pause' : 'pi-play'}`}

                pt={{
                  root: {
                    style: {
                      backgroundColor: 'var(--maskbg)',
                      borderColor: '#fff',
                      color: theme == 'light' ? 'var(--maskbg)' : '#fff',
                    }
                  },
                  icon: {
                    style: {
                      paddingLeft: playing && current_station?.id == station.id ? '0' : '4px',
                      color: '#fff',
                      fontWeight: 600,
                    }
                  }
                }}

                onClick={(e) => {
                  e.preventDefault()
                  click_play()
                }}
              />

              <div className="flex flex-column justify-content-between gap-2 flex-shrink-0">
                <AddStationToFavorites station={station} />

                <StationShareButton station={station} />
              </div>

              <YandexAd id="R-A-14083703-5" className="flex-grow-1 align-self-stretch h-5rem max-h-5rem" />
            </div>

            <div className="flex flex-row gap-2">
              <span className={`font-semibold select-none ${tag_text_class}`}>
                {translations.language}:
              </span>
              {
                edit_mode ?
                  <Controller
                    name="languages"
                    control={control}
                    render={({ field, }) => {
                      return (
                        <>
                          {/* Languages */}
                          <MultiSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={station_languages}
                            optionLabel={language ?? 'en'}
                            display="chip"
                            filter
                            placeholder={translations.language}
                            className="w-20rem max-w-full relative"
                            pt={multiselect_pt}
                          />
                        </>
                      )
                    }} />
                  :
                  <div className="flex flex-row flex-wrap gap-1">
                    {
                      station?.languages?.map((language, i, arr) =>
                        <>
                          <StationLanguageTag language_en={language} />
                          {
                            i < arr.length - 1 &&
                            <span className="text-base">
                              ,
                            </span>
                          }
                        </>
                      )
                    }
                  </div>
              }
            </div>

            <div className="flex flex-row gap-2">
              <span className={`font-semibold select-none ${tag_text_class}`}>
                {translations.genre}:
              </span>
              {
                edit_mode ?
                  <Controller
                    name="genres"
                    control={control}
                    render={({ field, }) => {
                      return (
                        <>
                          {/* Genres */}
                          <MultiSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={station_genres}
                            optionLabel={language ?? 'en'}
                            itemTemplate={GenreItemTemplate}
                            display="chip"
                            filter
                            placeholder={translations.genre}
                            className="w-20rem max-w-full relative"
                            pt={multiselect_pt}
                          />
                        </>
                      )
                    }} />
                  :
                  <div className="flex flex-row flex-wrap gap-1">
                    {
                      station?.genres?.map(genre => <StationGenreTag genre_en={genre} />)
                    }
                  </div>
              }
            </div>


            {
              edit_mode ?
                <Controller
                  name="tags"
                  control={control}
                  render={({ field, }) => (
                    <>
                      <div className="flex flex-column gap-2 relative">
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
                          onChange={e => {
                            //console.log('chips change : ', e)
                            change_station_tags(e, field)
                          }}

                          onKeyDown={
                            (e) => {
                              setTimeout(() => {
                                set_tags_suggestion_text((e.target as HTMLInputElement).value)
                              })
                            }
                          }

                          onAdd={
                            e => {
                              set_tags_suggestion_text('')
                            }
                          }

                          onFocus={() => {
                            set_tags_suggestion_focused(true)
                          }}

                          allowDuplicate={false}
                          removable

                          removeIcon={<StationTagRemoveTokenIcon onClick={e => click_station_tag_remove(e, field)} />}

                          separator=","

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

                          ref={tags_input_ref}
                        />

                        {
                          tags_suggestion_focused
                            && tags_suggestion_text ?
                            <div className="flex flex-row flex-wrap gap-2 absolute top-100 bottom-auto right-0 left-0 h-12rem overflow-y-scroll border-round-2xl surface-border bg-white p-2 z-1 shadow-3 align-items-start justify-content-start" ref={tags_suggestions_ref}>
                              {filtered_tags_suggestions}
                            </div>
                            : <></>
                        }

                      </div>
                    </>
                  )} />
                :
                <div className="flex flex-row gap-2">
                  <span className={`font-semibold select-none ${tag_text_class}`}>
                    {translations.tags}:
                  </span>
                  <div className="flex flex-row flex-wrap gap-1">
                    {
                      station?.tags?.map(tag => <StationTag tag={tag} />)
                    }
                  </div>
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
                    'surface-border',
                    tag_text_class,
                  ),
                  style: {
                    height: 'fit-content',
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
                      height: 'fit-content',
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
            mobile ? <></> :
              <YandexAd id="R-A-14083703-4" className="flex-grow-1 align-self-stretch" interval={60000} />
          }
        </div>

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