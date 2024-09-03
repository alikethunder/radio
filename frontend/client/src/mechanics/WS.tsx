import { FC, useMemo, useEffect, createRef, useState } from "react"

import Sockette from 'sockette'

import { actions, useTrackedStore, store, useStore } from "@/store"

export const WS: FC = () => {

  const signedin = useStore().auth.signedin()

  useEffect(() => {

    (async () => {

      if (signedin) {

        const ws = await new Promise((res, rej) => {
          let s = new Sockette(`ws://localhost:${import.meta.env.VITE_DEV_PORT}/ws`, {
            timeout: 5e3,
            maxAttempts: 1,//10,
            onopen: e => {
              //ws.json({ data: 'hello' })
              //console.log('Connected!')
              res(s)
            },
            onmessage: e => {
              //console.log('Received1:', e)
            },
            onreconnect: e => {
              //console.log('Reconnecting...',)

            },
            //onmaximum: e => console.log('Stop Attempting!',),
            //onclose: e => console.log('Closed!',),
            onerror: e => {
              console.log('Error:', e)
              rej(e)
            }
          })
        })
      }
    })()
  }, [signedin])

  return (<></>)
}