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

  FormStateActions_state: FormState["state"];
  FormStateActions_edit: FormState["edit"];
  FormStateActions_submit: FormState["submit"];
  FormStateActions_reset: FormState["reset"];
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
  FormStateActions_state: 'read',
  FormStateActions_submit: null,
  FormStateActions_reset: null,
  FormStateActions_edit: null,
} as AppStore)