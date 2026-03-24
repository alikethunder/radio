import { FC, memo, useState } from "react"

import {
  actions,
  useStore,
} from "@/store"

import { DataView } from 'primereact/dataview'

import { Dialog } from "primereact/dialog"

import { useTranslations } from "@/hooks"

import { ReactComponent as VisaSvg } from '@/assets/svg/visa.svg'
import { ReactComponent as USDTSvg } from '@/assets/svg/usdt.svg'
import { ReactComponent as MirSvg } from '@/assets/svg/mir.svg'
import { ReactComponent as BTCSvg } from '@/assets/svg/btc.svg'
import { ReactComponent as EthSvg } from '@/assets/svg/eth.svg'

const svg_class = 'w-3rem h-3rem'
const clipboard_supported = !!navigator.clipboard.writeText

export const SupportDialog: FC = memo(() => {

  const open_support_dialog = useStore().app.open_support_dialog()

  const [translations] = useTranslations([
    'support_project',
  ], true)

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const methods = [
    {
      name: 'Visa',
      details: '(IBAN) KZ05722C000073398318',
      image: <VisaSvg className={`${svg_class}`} />
    },
    {
      name: 'МИР',
      details: '4081 7810 3000 9271 0245',
      image: <MirSvg className={`${svg_class}`} />
    },
    {
      name: 'USDT',
      details: '(TRC20) TDWbAfE67L5FYixKznseg3fbvqN2HUSq83',
      image: <USDTSvg className={`${svg_class}`} />
    },
    {
      name: 'BTC',
      details: '(BTC) 1HqYBJ7izTS25KFGhT8H7X2gft85vT4wui',
      image: <BTCSvg className={`${svg_class}`} />
    },
    {
      name: 'Ethereum',
      details: '(ERC20) 0x6fcff52038a0d4a3102ede07e75cd79fdfdcca99',
      image: <EthSvg className={`${svg_class}`} />
    }
  ]

  const handleCopy = async (details: string, index: number) => {
    if (!clipboard_supported) return

    try {
      await navigator.clipboard.writeText(details)
      setCopiedIndex(index)

      setTimeout(() => {
        setCopiedIndex(null)
      }, 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const list = methods.map((method, index) =>
    <div className="col-12" key={method.name}>
      <div className='flex flex-column gap-1 align-items-center border-top-1 surface-border p-1 sm:p-2'>
        <div className="flex flex-row align-items-center gap-1">
          {method.image}


          <div className="ml-1 text-2xl font-bold text-900">
            {method.name}
          </div>

          {
            clipboard_supported ?
              <i
                className={`pi ${copiedIndex === index ? 'pi-check' : 'pi-copy'}`}
                onClick={() => handleCopy(method.details, index)}
                style={{ cursor: 'pointer' }}
              ></i>
              : <></>
          }
        </div>

        <div className="text-center" style={{ wordBreak: 'break-word' }}>
          {method.details}
        </div>

      </div>
    </div>
  )

  return (
    <Dialog
      visible={open_support_dialog}
      modal
      style={{
        width: '25rem',
        maxWidth: '85vw',
      }}
      onHide={() => actions.app.open_support_dialog(false)}
      resizable={false}
      dismissableMask={true}
      draggable={false}

      pt={{
        content: {
          className: 'flex flex-column gap-2 py-3 px-0',
        }
      }}

      content={() => <>
        <div className="text-center p-2 sm:p-4 pr-2 sm:pr-2 align-items-center surface-card text-2xl">
          {translations.support_project}
        </div>
        {/* @ts-ignore */}
        <DataView listTemplate={<div className="grid grid-nogutter">{list}</div>} />
      </>}
    >
    </Dialog >
  )
})