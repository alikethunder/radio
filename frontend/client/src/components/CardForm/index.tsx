import { FC, useCallback, useEffect, useRef, useState } from "react"

import {
  json,
  useLoaderData,
  redirect,
  RouteObject,
  useNavigate,
} from "react-router-dom"

import { CardPageParams } from "@/types/card"

import { FileUpload } from 'primereact/fileupload'

import { Button } from 'primereact/button'

import {
  useRefCallback
} from '@/hooks'

import './index.sass'

export const CardForm = () => {

  const navigate = useNavigate()

  const { pageId } = useLoaderData() as CardPageParams

  const [height, setHeight] = useState<number | null>(null)

  const [background, setBackground] = useState<File | undefined>()

  const [new_card_node, new_card_ref] = useRefCallback()

  useEffect(() => {
    if (new_card_node) {

      setHeight(new_card_node.getBoundingClientRect().height)

      new ResizeObserver(() => {

        setHeight(new_card_node.getBoundingClientRect().height)

      }).observe(new_card_node)
    }
  }, [new_card_node])

  const selectBackground = (e: any) => {
    console.log('[CardForm] selectBackground : ', e.target.files)
    const file = e.target.files[0]
    setBackground(file)
  }

  const removeBackground = (e: any) => {
    console.log('[CardForm] removeBackground : ',)
    setBackground(undefined)
  }

  return (
    <div className="md:py-4 py-0 sm:px-4 px-2 w-full h-full card_form flex flex-column">

      <div className="form">

        <div className="flex flex-column">

          <span className="p-buttonset">
            <Button label="Card background" raised icon="pi pi-image"
              onClick={//@ts-ignore
                (e) => e.target.querySelector('input')?.click()
              }>
              <input style={{ display: 'none' }} type="file" accept="image/*" onChange={selectBackground} />
            </Button>
            <Button icon="pi pi-times" onClick={removeBackground} />
          </span>

          {background?.name}
        </div>

      </div>

      <div className="new_card shadow-2 border-round align-self-center" ref={new_card_ref} style={height ? { '--card-height': `${height}px` } : {}} >
        {
          background ?
            <img
              className="card_background"
              src={URL.createObjectURL(background)} />
            : ''
        }
      </div>

    </div >
  )
}