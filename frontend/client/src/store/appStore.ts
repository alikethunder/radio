import { createStore } from '@udecode/zustood'

import {
  createBrowserRouter
} from "react-router-dom"

type AppStore = {
  isClient: boolean;
  router: ReturnType<typeof createBrowserRouter> | null;
}

export const appStore = createStore('app')({
  //to render client parts only
  isClient: false,
  router: null,
} as AppStore)