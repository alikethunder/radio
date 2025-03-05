import { store } from "@/store"

export const ga_event = (data: { 
  event: string,
  [x: string]: any,
 }) => {
  const signedin = store.auth.signedin()

  window.dataLayer.push({
    ...data,
    user_id: signedin ? store.user.id() : store.persistedApp.user_uuid(),
    signedin,
  })
}