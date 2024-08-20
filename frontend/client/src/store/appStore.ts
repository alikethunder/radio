import { createStore } from 'zustand-x'

import {
  createBrowserRouter
} from "react-router-dom"

import {
  app_routes,
} from '@/constants/router'

import {
  FormState
} from '@/types/FormState'

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
  leftSidebarOpened: boolean;
  prev_pathname: string;
  current_page: {
    name: string;
    icon: string;
  };

  FormActionsState_state: FormState["state"];
  FormActionsState_edit: FormState["edit"];
  FormActionsState_submit: FormState["submit"];
  FormActionsState_reset: FormState["reset"];

  user_photo_data_url: null | string;
}

export const appStore = createStore('app')({
  //to render client parts only
  isClient: false,
  router: null,
  rightSidebarOpened: false,
  leftSidebarOpened: false,
  isDesktop: false,
  windowSize: {
    width: 0,
    height: 0
  },
  subscription_plans: [],
  subscription_plans_loading: false,
  prev_pathname: app_routes.root,
  current_page: {
    name: '',
    icon: '',
  },
  FormActionsState_state: 'read',
  FormActionsState_submit: null,
  FormActionsState_reset: null,
  FormActionsState_edit: null,
  user_photo_data_url: null,
} as AppStore)