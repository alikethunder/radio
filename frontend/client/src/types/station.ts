export type Station = {
  id: string,
  name: string,
  description: string,
  avatar: Blob,
  background: Blob,
  broadcasting: boolean,
  tags: string[],
  admins: string[],
  render_order: number,
  likes: number
}