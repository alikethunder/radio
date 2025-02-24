import { FC, memo, useCallback, useEffect, useState } from "react"

import {
  generatePath,
  useNavigate,
} from "react-router-dom"

import { Button } from 'primereact/button'

import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md"
import { IoDiceSharp } from "react-icons/io5"

import {
  actions,
  useStore,
  store,
} from "@/store"

import {
  app_routes,
} from '@/constants/router'

import {
  QueryLink,
  AddStationToFavorites,
  StationAvatar,
  StationInfoButton,
  StationShareButton,
  YandexAd,
} from '@/components'

import { Slider } from "primereact/slider"

import { classNames } from "primereact/utils"
import { NumRange } from "@/types/generics/range"
import { useMobile, useTooltip, useTranslations, } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"

import './index.sass'
import { switch_to_random_station } from "@/functions"
import { HistoryRecord } from "@/types"
import { v7 } from "uuid"

export const Player: FC = memo(() => {

  const navigate = useNavigate()

  const mobile = useMobile()

  const signedin = useStore().auth.signedin()

  const history_loaded = useStore().player.history_loaded()

  const search_panel_closed = useStore().persistedApp.search_panel_closed()

  const [container_ref, set_container_ref] = useState<HTMLDivElement | null>(null)

  const set_c_ref = useCallback((e: HTMLDivElement | null) => {
    set_container_ref(e)
  }, [])

  const [audio_ref, set_audio_ref] = useState<HTMLAudioElement | null>(null)

  const playing = useStore().player.playing()

  const volume = useStore().player.volume()

  const current_station = useStore().player.current_station()

  const theme = useStore().persistedApp.theme()

  const [offline, set_offline] = useState(false)

  const manage_play = useCallback(() => {

    const current_station = store.player.current_station()
    const playing = store.player.playing()

    set_audio_ref(audio_ref => {
      set_offline(offline => {
        if (current_station && audio_ref) {
          if (playing && !offline) {
            audio_ref.src = current_station?.external_enable ? current_station?.external : ''
            audio_ref.play().catch((e) => {
              console.log('[Player] play error : ', e)
              actions.player.playing(false)
              audio_ref.pause()
            })
          } else {
            audio_ref.pause()
            //audio_ref.removeAttribute('src')
          }
        }
        return offline
      })

      return audio_ref
    })
  }, [])

  useEffect(() => {
    manage_play()
  }, [
    playing,
    current_station,
  ])

  useEffect(() => {
    if (audio_ref) {
      audio_ref.volume = volume / 100
    }
  }, [volume, audio_ref])

  const [translations] = useTranslations([
    'mute',
    'unmute',
    'volume',
    'play',
    'pause',
    'minimize_player',
    'maximize_player',
    'random_station',
  ], true)

  const switch_playing = useDebounceCallback(() => actions.player.switch_playing(), 50)

  const click_volume_icon = useDebounceCallback(() => {
    const v = store.player.volume()
    if (v) {
      actions.player.prev_volume(v)
      actions.player.volume(0)
    } else {
      actions.player.volume(store.player.prev_volume() ?? 100)
    }
  }, 50)

  const onoffline = useCallback((e: Event) => {
    set_offline(true)
    manage_play()
  }, [])

  const ononline = useCallback((e: Event) => {
    set_offline(false)
    manage_play()
  }, [])

  useEffect(() => {
    window.addEventListener('online', ononline)

    window.addEventListener('offline', onoffline)

    return () => {
      window.removeEventListener('offline', onoffline)
      window.removeEventListener('online', ononline)
    }
  }, [])

  const minimized = useStore().player.minimized()

  const maximize_tooltip = useTooltip(minimized ? translations.maximize_player : translations.minimize_player)

  const random_tooltip = useTooltip(translations.random_station)

  const toggle_player = useCallback(useDebounceCallback(() => {
    actions.player.toggle_player_size()
  }, 50), [])

  const play_random_station = useCallback(useDebounceCallback(() => {

    const stations = store.app.stations_home()

    if (!stations.length) {
      navigate('/')
    }

    switch_to_random_station(stations)
  }, 50), [])

  useEffect(() => {
    // minimize/maximize player on touch scroll
    if (container_ref) {
      let touch_start: number | null

      const touch_start_f = (e: TouchEvent) => {
        touch_start = e.changedTouches[0].clientY
      }

      const touch_move_f = (e: TouchEvent) => {
        e.preventDefault()
        if (touch_start) {
          actions.player.minimized(e.changedTouches[0].clientY < touch_start)
        }
      }

      container_ref.addEventListener('touchstart', touch_start_f)

      container_ref.addEventListener('touchmove', touch_move_f, { passive: false })

      return () => {
        container_ref.removeEventListener('touchstart', touch_start_f)
        container_ref.removeEventListener('touchmove', touch_move_f)
      }
    }
  }, [container_ref])

  useEffect(() => {
    //stations history update
    if (history_loaded) {

      if (current_station) {
        const last_record = store.player.history_get_from_last(0)

        console.log('last record : ', last_record, current_station.id)

        if (last_record?.station_id !== current_station.id) {

          (async () => {
            let record: HistoryRecord = {
              date: '',
              station_id: current_station.id,
            }

            if (signedin) {
              const resp = await fetch(`/api/v1/history/${current_station.id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
              })
              record = { ...record, ...await resp.json() }
              console.log('signedin history : ', record)
            } else {
              const resp = await fetch('/api/v1/history/date')
              record.date = await resp.text()
              record.id = v7()
              console.log('non signedin history : ', record)
            }
            actions.player.history_add(record)
          })()
        }
      }
    }
  }, [
    current_station,
    signedin,
    history_loaded,
  ])

  return (
    <div
      id="player"
      className={`flex flex-row flex-shrink-0 z-2 ${search_panel_closed ? 'shadow-2' : ''} surface-card p-2 md:pl-3 gap-2 md:gap-3 mt-auto transition-all transition-duration-300 transition-linear ${current_station ? 'opened' : ''} ${minimized ? 'h-5rem' : 'h-9rem'}`}
      style={{
        borderBottom: '1px solid var(--surface-border)',
      }}
      ref={set_c_ref}
    >

      <audio
        src=""
        style={{
          display: 'none'
        }}
        ref={set_audio_ref}
      />

      <div className={`flex flex-column flex-shrink-0 ${minimized ? '' : 'pb-2'}`}>

        {
          current_station && !minimized ?
            <>

              <StationShareButton station={current_station} />

              <AddStationToFavorites station={current_station} show_likes className="mt-auto" />

            </>
            : <></>
        }

        <Button
          icon={`pi pi-angle-${minimized ? 'down' : 'up'}`}
          rounded
          outlined
          raised
          className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center text-600 mt-auto`}
          severity={`help`}

          onClick={toggle_player}

          {...maximize_tooltip}
        />

      </div>

      <div className="flex flex-column gap-2 align-items-center flex-shrink-0  relative">

        <StationAvatar
          id={current_station?.id}
          className="w-4rem h-4rem shadow-2 flex-shrink-0 border-round-xl"
        />

        <div className={`overlay absolute top-0 left-0 right-0 bottom-0 p-component-overlay border-round-xl transition-all transition-duration-300 transition-linear ${minimized ? 'opacity-80' : 'opacity-0'}`} />

        <Button
          className={`shadow_on_hover active_element p-0 flex-shrink-0 hover:text-primary hover:border-primary player_play_button justify-content-center ${playing ? '' : 'paused'} ${minimized ? 'absolute top-0 bottom-0 my-auto' : ''}`}

          rounded
          outlined
          raised
          aria-label={`${playing ? translations.pause : translations.play}`}
          severity="info"

          pt={{
            root: {
              style: {
                backgroundColor: 'var(--maskbg)',
                borderColor: offline ? 'red' : '#fff',
                color: offline ? 'red' : theme == 'light' ? 'var(--maskbg)' : '#fff',
              }
            },
          }}

          onClick={switch_playing}
          disabled={offline}
        >
          {
            offline ?
              <MdSignalWifiConnectedNoInternet0 />
              :
              <i className={`pi text-3xl ${playing ? 'pi-pause' : 'pi-play padding_left_2px'}`}></i>
          }
        </Button>

      </div>

      <div className="flex flex-column md:flex-shrink-0 flex-grow-1 max-w-20rem justify-content-between">

        {/* current station name */}
        {
          current_station ?
            <QueryLink to={generatePath(app_routes["station$id"], { id: current_station?.id })} className={`font-bold text-primary text_hidden_overflow text-lg align-self-start ${minimized ? 'line-clamp-1' : 'line-clamp-2 h-3rem'}`}>
              {current_station?.name}
            </QueryLink>
            : <></>
        }

        {
          minimized ? <></> :
            <div className="buttons flex flex-row gap-2">
              {
                current_station ?
                  <>
                    <StationInfoButton station={current_station} />
                  </>
                  : <></>
              }

              <Button
                rounded
                outlined
                raised
                className={`p-0 w-2rem h-2rem shadow_on_hover align-self-center flex flex-shrink-0 justify-content-center align-items-center`}
                style={{
                  color: '#696cff'
                }}

                onClick={play_random_station}

                {...random_tooltip}
              >
                <IoDiceSharp style={{
                  width: '1.5rem',
                  height: '1.5rem',
                }} />
              </Button>
            </div>
        }

        <div className="volume_controls flex flex-row gap-1 md:gap-3">

          <Slider
            value={volume}

            aria-label={translations.volume}

            onChange={(e) => {
              actions.player.volume(e.value as NumRange<101>)
            }}
            className="md:w-8rem align-self-center mr-2 flex-grow-1"
            orientation="horizontal"
            pt={{
              range: {
                className: classNames({},
                  'bg-secondary',
                  'shadow_glow',
                ),
                style: {
                  color: 'var(--secondary-color)',
                }
              },
              handle: {
                className: classNames({},
                  'hover:bg-cyan-500',
                  'border-secondary',
                  'text-cyan-500',
                  'shadow_on_hover',
                ),
              }
            }}
          />

          <div className="flex flex-row align-items-center text-gray-500 gap-1 flex-shrink-0">

            <span className="w-2rem">
              {volume}
            </span>

            {/* volume icon */}
            <Button
              icon={`pi pi-${volume ? 'volume-up' : 'volume-off text-sm mr-1'}`}
              rounded
              outlined
              raised
              aria-label={volume ? translations.mute : translations.unmute}
              className={`p-0 w-2rem h-2rem shadow_on_hover ${volume ? '' : 'pr-1'}`}
              severity={`warning`}

              onClick={click_volume_icon}
            />
          </div>
        </div>

      </div>

      {
        mobile ? <></> :
          <YandexAd id="R-A-14083703-1" className="flex-grow-1 align-self-stretch" update_dependency={minimized} />
      }

    </div>
  )
})