import { useRef, useState } from 'react'
import { Button } from '../ui/Button'

const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif'

type Props = {
  dataUrl: string | null
  onChange: (dataUrl: string | null) => void
  disabled?: boolean
}

export function ScreenshotUpload({ dataUrl, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  function pickFile() {
    setError(null)
    inputRef.current?.click()
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Fichier non image.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const r = reader.result
      if (typeof r === 'string') {
        onChange(r)
        setError(null)
      }
    }
    reader.onerror = () => setError('Lecture impossible.')
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-1.5">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        disabled={disabled}
        onChange={onFile}
      />
      <div className="flex flex-wrap gap-1">
        <Button type="button" variant="secondary" disabled={disabled} onClick={pickFile}>
          {dataUrl ? 'Remplacer' : 'Choisir fichier'}
        </Button>
        {dataUrl ? (
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            Retirer
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-[11px] text-red-800">{error}</p> : null}
      {dataUrl ? (
        <div className="border border-edf-border bg-edf-panel">
          <img
            src={dataUrl}
            alt="Aperçu"
            className="max-h-48 w-full object-contain object-top-left"
          />
        </div>
      ) : (
        <p className="text-[11px] text-edf-muted">
          PNG, JPEG, WebP, GIF · stockage local (data URL).
        </p>
      )}
    </div>
  )
}
