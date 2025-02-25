import { createStore } from 'zustand-x'

import {
  createBrowserRouter
} from "react-router-dom"

import {
  FormState
} from '@/types/FormState'

import { Station } from '@/types';

type AppStore = {
  isClient: boolean;
  router: ReturnType<typeof createBrowserRouter> | null;
  isDesktop: boolean;
  windowSize: {
    width: number;
    height: number;
  };
  subscription_plans: [];
  subscription_plans_loading: boolean;
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
  text_search_in_progress: boolean;
  stations_home_last_id: string | null;
  stations_home: Station[];
  stations_home_loaded: boolean;
  stations_favorite_loaded: boolean;
  hover_tooltip_targetid: string;
  hover_tooltip_content: string;
  station_info_dialog: Station | null;
  share_stations_list: Station[];
  share_list_popup_opened: boolean;
  history_loaded: boolean,
}

const initial_state = {
  //to render client parts only
  isClient: false,
  router: null,
  isDesktop: false,
  windowSize: {
    width: 0,
    height: 0
  },
  subscription_plans: [],
  subscription_plans_loading: false,
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
  text_search_in_progress: false,
  stations_home_last_id: null,
  stations_home: [],
  stations_home_loaded: false,
  stations_favorite_loaded: false,
  hover_tooltip_targetid: 'null',
  hover_tooltip_content: '',
  station_info_dialog: null,
  share_stations_list: [],
  share_list_popup_opened: false,
  history_loaded: false,
} as AppStore

export const appStore = createStore('app')(initial_state)
  .extendSelectors((state, get, api) => ({
    FormActionsState_edit_mode: () => get.FormActionsState_state() == 'edit',
  }))
  .extendActions((set, get, api) => ({
    add_stations_home(stations: Station[]) {
      const stations_home = get.stations_home()
      set.stations_home(stations_home.concat(stations))
    },
  }))