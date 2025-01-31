export type Station = {
  id: string,
  name: string,
  avatar: Blob,
  background: Blob,
  broadcasting: boolean,
  tags: string[],
  admins: string[],
  render_order: number,
  external: string,
  external_enable: boolean,
  languages: string[] | null,
  genres: string[] | null,
} & {
  [x: string]: string,
}