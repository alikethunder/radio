import { FC, memo, useCallback, useEffect, useMemo, useState, } from "react"

import {
  actions,
  useStore,
} from "@/store"

import { Dialog } from "primereact/dialog"
import {
  StationAvatar,
  ShareListIcon,
  StationCountryFlag,
  StationInfoButton,
} from "@/components"

import { useTranslations } from "@/hooks"

import { Button } from "primereact/button"
import { useDebounceCallback } from "usehooks-ts"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Station } from "@/types"

import { compressToEncodedURIComponent, } from 'lz-string'
import { ga_event } from "@/functions"

export const ShareListPopup: FC = memo(() => {

  const stations = useStore().app.share_stations_list()

  const share_list_popup_opened = useStore().app.share_list_popup_opened()

  useEffect(() => {
    set_selected(stations)
  }, [stations])

  const [selected, set_selected] = useState<Station[]>([])

  const [translations] = useTranslations([
    'share_stations_list',
    'share',
    'choose_stations_to_share',
    'selected',
    'number_of_stations',
  ], true)

  const [loading, set_loading] = useState(false)

  const send = useCallback(useDebounceCallback(async () => {
    if (selected.length) {
      set_loading(true)
      const ids = selected.map(s => s.id)

      const ids_string = ids.join(',')

      const compressed = compressToEncodedURIComponent(ids_string)

      const sharedData = {
        title: `${translations.number_of_stations}: ${selected.length}`,
        url: `https://radio.best/shared/${compressed}`,
      }

      try {
        await navigator.share(sharedData);

        ga_event({
          event: 'share_list',
          ids: ids_string,
        })
      } catch (e) {
        console.error('[ShareListPopup] share error :', e)

        ga_event({
          event: 'share_list_error',
          ids: ids_string,
          error: e,
        })
      }
      set_loading(false)
    }
  }, 50), [
    translations.number_of_stations,
    selected,
  ])

  const selected_length = useMemo(() => selected.length, [selected.length])

  const button_disabled = useMemo(() => !selected_length, [selected_length])

  const popup_header = useMemo(() =>
    <div className="flex flex-column gap-2">
      {translations.choose_stations_to_share}

      <Button
        loading={loading}
        onClick={send}
        className="text-white font-medium py-0 px-2 align-items-center raised shadow_on_hover flex-shrink-0 align-self-start"
        disabled={button_disabled}
      >
        {translations.share}
        <div className="w-2rem h-2rem">
          <ShareListIcon background="var(--primary-color)" />
        </div>
      </Button>
    </div>
    , [
      translations.share,
      loading,
      send,
      translations.choose_stations_to_share,
      button_disabled,
    ])

  const image = useCallback((station: Station) => <>
    <StationAvatar id={station.id} className="w-3rem h-3rem shadow-2 border-round-sm" />
  </>, [])

  const country = useCallback((station: Station) => <>
    <StationCountryFlag en={station.country} disable_link className="" />
  </>, [])

  const info = useCallback((station: Station) => <StationInfoButton station={station} />, [])

  return (
    <Dialog
      visible={Boolean(stations.length) && share_list_popup_opened}
      modal
      header={popup_header}
      style={{
        width: '50rem',
        maxWidth: '95vw',
      }}
      onHide={() => {
        actions.app.share_list_popup_opened(false)
      }}
      resizable={false}
      dismissableMask={true}
      draggable={false}

      pt={{
        header: {
          className: 'p-3 pr-0 pb-0',
        },
        content: {
          className: 'flex flex-column pt-2 px-0 pb-0',
        },
        headerIcons: {
          className: '-mt-2 sm:-mt-3',
        }
      }}
      contentStyle={{ height: '300px' }}
    >

      <DataTable
        value={stations}
        header={<>{translations.selected}: {selected_length} </>}
        selectionMode={null}
        dataKey="id"
        selection={selected}
        scrollable
        scrollHeight="flex"
        onSelectionChange={e => set_selected(e.value)}
        pt={{
          header: {
            className: 'p-0 pb-1 pl-3 bg-transparent border-top-none',
          },
          column: {
            headerCell: {
              className: 'p-1 py-2',
            },
            bodyCell: {
              className: 'p-1',
            }
          },
        }}
      >
        <Column selectionMode="multiple" pt={{
          headerCell: {
            className: 'pl-3',
          },
          bodyCell: {
            className: 'pl-3',
          }
        }}
          headerStyle={{ width: '2rem' }} />

        {/* image */}
        <Column body={image} pt={{
          headerCell: {
            className: 'w-3rem md:w-4rem',
          }
        }} />

        {/* country */}
        <Column body={country} pt={{

        }} headerStyle={{ width: '2rem' }} />

        {/* name */}
        <Column field="name" sortable />

        {/* info */}
        <Column body={info} headerStyle={{ width: '2rem' }} pt={{
          bodyCell: {
            className: 'pr-2',
          }
        }} />

      </DataTable>
    </Dialog>
  )
})