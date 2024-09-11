import {
  actions,
} from "@/store"

export const setForm = (e: HTMLFormElement) => actions.app.FormActionsState_form(e)