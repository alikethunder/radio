import { FC, memo, useCallback, useEffect, useState } from "react"

import {
  generatePath,
} from "react-router-dom"

//import { TabMenu } from 'primereact/tabmenu'
import { Button } from 'primereact/button'

import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md"

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
import { useTranslations, } from "@/hooks"
import { useDebounceCallback } from "usehooks-ts"

import './index.sass'

export const Player: FC = memo(() => {

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

  return (
    <div id="player" className={`flex flex-row flex-shrink-0 shadow-3 h-9rem surface-card p-2 md:pl-6 gap-3 mt-auto ${current_station ? 'opened' : ''}`}>

      <audio
        src=""
        style={{
          display: 'none'
        }}
        ref={set_audio_ref}
      />

      <div className="flex flex-column gap-2 align-items-center flex-shrink-0">

        <StationAvatar
          id={current_station?.id}
          className="w-4rem h-4rem shadow-2 flex-shrink-0 border-round-xl"
        />

        <Button
          className={`shadow_on_hover active_element p-0 flex-shrink-0 hover:text-primary hover:border-primary player_play_button justify-content-center ${playing ? '' : 'paused'}`}

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

      <div className="flex flex-column flex-shrink-0 flex-grow-1 max-w-20rem justify-content-between">

        {/* current station name */}
        {
          current_station ?
            <QueryLink to={generatePath(app_routes["station$id"], { id: current_station?.id })} className="font-bold text-primary text_hidden_overflow line-clamp-2 h-3rem text-lg">
              {current_station?.name}
            </QueryLink>
            : <></>
        }

        <div className="buttons flex flex-row gap-2">
          {
            current_station ?
              <>
                <AddStationToFavorites station={current_station} />

                <StationShareButton station={current_station} />

                <StationInfoButton station={current_station} />
              </>
              : <></>
          }
        </div>


        <div className="volume_controls flex flex-row gap-3">

          <Slider
            value={volume}

            aria-label={translations.volume}

            onChange={(e) => {
              actions.player.volume(e.value as NumRange<101>)
            }}
            className="w-8rem align-self-center mx-1"
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

          <div className="flex flex-row align-items-center text-gray-500 gap-1">

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

      <YandexAd id="R-A-14083703-1" className="flex-grow-1 align-self-stretch" onlyDesktop hideOpacity />

    </div>
  )
})