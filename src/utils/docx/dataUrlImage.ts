export type RasterImageType = 'png' | 'jpg' | 'gif' | 'bmp'

export type DecodedRasterImage = {
  type: RasterImageType
  data: Uint8Array
}

const MIME_TO_TYPE: Record<string, RasterImageType> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
}

/**
 * Découpe une data URL ; retourne null si mime non pris en charge par OOXML (ex. WebP).
 */
export function decodeDataUrlImage(dataUrl: string): DecodedRasterImage | null {
  const m = dataUrl.match(/^data:([^;,]+);base64,(.+)$/i)
  if (!m) return null
  const mime = m[1].toLowerCase().trim()
  const type = MIME_TO_TYPE[mime]
  if (!type) return null
  try {
    const b64 = m[2]
    const binary = atob(b64)
    const len = binary.length
    const data = new Uint8Array(len)
    for (let i = 0; i < len; i++) data[i] = binary.charCodeAt(i)
    return { type, data }
  } catch {
    return null
  }
}

export function getBitmapDimensions(
  dataUrl: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error('Impossible de lire les dimensions de l’image.'))
    img.src = dataUrl
  })
}

export function scaleToMaxWidth(
  width: number,
  height: number,
  maxWidth: number,
): { width: number; height: number } {
  if (width <= 0 || height <= 0) return { width: maxWidth, height: maxWidth }
  if (width <= maxWidth) return { width, height }
  const r = maxWidth / width
  return { width: Math.round(maxWidth), height: Math.round(height * r) }
}
