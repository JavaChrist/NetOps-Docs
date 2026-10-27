import {
  EDF_LOGO_PNG_DATA_URL,
  EDF_LOGO_PNG_HEIGHT,
  EDF_LOGO_PNG_WIDTH,
} from '../../utils/edfLogoAsset'

/** Logo EDF officiel (soleil orange + « edf ») sur fond transparent. */
export function EdfHeaderLogoLockup({
  className = '',
  width = 96,
}: {
  className?: string
  width?: number
}) {
  const height = Math.round((EDF_LOGO_PNG_HEIGHT / EDF_LOGO_PNG_WIDTH) * width)
  return (
    <img
      src={EDF_LOGO_PNG_DATA_URL}
      alt="EDF"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
    />
  )
}
