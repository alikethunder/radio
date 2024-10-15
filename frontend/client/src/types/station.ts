export type Station = {
  id: string,
  name: string,
  avatar: Blob,
  background: Blob,
  broadcasting: boolean,
  tags: string[],
  admins: string[],
  render_order: number,
  likes: number,
  external: string,
  external_enable: boolean,
} & {
  [x: string]: string,
}