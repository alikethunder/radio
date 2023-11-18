import { createStore } from '@udecode/zustood'

import { Toast, ToastProps } from 'primereact/toast'

type ToastStore = {
  [key in Exclude<ToastProps['position'], undefined>]: Toast;
}

export const toastStore = createStore('app')({
  ...Object.fromEntries(["center", "bottom-right", "bottom-left", "top-right", "top-left", "top-center", "bottom-center"].map(position => [position, {}]))
} as ToastStore)