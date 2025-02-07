import { FC, memo, } from "react"

import {
  actions,
  useStore,
} from "@/store"

import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { StationAvatar } from "../StationAvatar"

export const StationInfoDialog: FC = memo(() => {

  const station = useStore().app.station_info_dialog()

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">

      <StationAvatar
        id={station?.id}
        className="w-4rem h-4rem sm:w-6rem sm:h-6rem shadow-2 flex-shrink-0 border-round-xl"
      />

      <span className="font-bold white-space-nowrap">Amy Elsner</span>
    </div>
  )

  return (
    <Dialog
      visible={Boolean(station)}
      modal
      header={headerElement}
      style={{
        width: '50rem',
        maxWidth: '90vw',
      }}
      onHide={() => actions.app.station_info_dialog(null)}
      resizable={false}
      dismissableMask={true}

    >
      <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Dialog>
  )
})