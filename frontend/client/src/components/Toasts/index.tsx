import { FC, useCallback, useEffect } from "react"

import { Toast, ToastProps } from 'primereact/toast'
import { actions, store } from "../../store"

export const Toasts: FC = () => {
  const positions = Object.getOwnPropertyNames(store.toast).filter(p=>p!='state') as ToastProps['position'][]
  
  const toastRef = useCallback((node: Toast) => {
    if (node !== null && node?.props?.position) {
      actions.toast[node.props.position](node)
    }
  }, [])

  return (
    <>
      {
        positions.map(position =>
          position ?
          <Toast ref={toastRef} position={position} key={`toast-${position}`}/>
          : ''
        )
      }
    </>
  )
}