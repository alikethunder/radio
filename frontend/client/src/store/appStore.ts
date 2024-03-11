import { createStore } from '@udecode/zustood'

import {
  createBrowserRouter
} from "react-router-dom"

type AppStore = {
  isClient: boolean;
  router: ReturnType<typeof createBrowserRouter> | null;
  rightSidebarOpened: boolean;
  isDesktop: boolean;
  windowSize: {
    width: number;
    height: number;
  };
  subscription_plans: [];
  subscription_plans_loading: boolean;
}

export const appStore = createStore('app')({
  //to render client parts only
  isClient: false,
  router: null,
  rightSidebarOpened: false,
  isDesktop: false,
  windowSize: {
    width: 0,
    height: 0
  },
  subscription_plans: [],
  subscription_plans_loading: false,
} as AppStore)