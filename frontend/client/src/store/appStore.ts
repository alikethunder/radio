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

import {
  StationTag,
} from '@/types'

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
    name?: string;
    icon?: string;
  };

  FormActionsState_state: FormState["state"];
  FormActionsState_edit: FormState["edit"];
  FormActionsState_submit: FormState["submit"];
  FormActionsState_reset: FormState["reset"];
  FormActionsState_form: FormState["form"];
  FormActionsState_isValid: boolean;
  FormActionsState_show: boolean;
  station_tags: StationTag[];
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
  FormActionsState_submit: undefined,
  FormActionsState_reset: undefined,
  FormActionsState_edit: undefined,
  FormActionsState_form: undefined,
  FormActionsState_isValid: false,
  FormActionsState_show: false,
  station_tags: [],
} as AppStore)
  .extendSelectors((state, get, api) => ({
    FormActionsState_edit_mode: () => get.FormActionsState_state() == 'edit',
    get_station_tag(name: string) {
      console.log('get_station_tag : ', name, get.station_tags())
      return get.station_tags()?.find(t => t.name == name)
    },
  }))