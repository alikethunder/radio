import { get_api_origin } from "@/functions"
import { Language } from "@/types"

export const get_station_description: (
  id: string,
  language: Language,
) => Promise<string> = async (id, language) => {
  const resp = await fetch(`${get_api_origin()}/api/v1/radio/description/${id}/${language}`)

  if (resp.status == 200) {
    const text = await resp.text()

    return text
  }

  return ''
}