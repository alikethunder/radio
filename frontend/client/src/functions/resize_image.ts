export const resize_image = async (file: File, size?: {
  width?: number;
  height?: number;
}): Promise<[Blob | null, string]> => {
  //size ??= 128
  size ??= {}
  size.width ??= 128
  size.height ??= 128

  const { width: target_width, height: target_height } = size

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = target_width
  canvas.height = target_height

  const bitmap = await createImageBitmap(file)

  const { width: file_width, height: file_height } = bitmap

  const ratio = Math.max(target_width / file_width, target_height / file_height)

  const x = (target_width - (file_width * ratio)) / 2
  const y = (target_height - (file_height * ratio)) / 2

  ctx?.drawImage(bitmap, 0, 0, file_width, file_height, x, y, file_width * ratio, file_height * ratio)

  return await Promise.all([
    new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob)
      }, 'image/webp', 1)
    }) as Promise<Blob | null>,
    canvas.toDataURL('image/webp', 1)
  ])
}