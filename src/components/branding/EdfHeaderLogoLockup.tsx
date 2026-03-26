/**
 * Bloc logo UNITEP « capture » : pictogramme orange + libellé « eDF » bleu foncé.
 */
export function EdfHeaderLogoLockup({
  className = '',
  iconSize = 40,
}: {
  className?: string
  iconSize?: number
}) {
  const h = Math.round(iconSize * 1.05)
  return (
    <div
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={h}
        viewBox="0 0 48 50"
        className="shrink-0"
      >
        <title>EDF</title>
        {/* Soleil / fleur stylisée type modèle papier */}
        <circle cx="24" cy="25" r="7" fill="#F39200" />
        <g fill="#F39200">
          <ellipse cx="24" cy="10" rx="5" ry="8" />
          <ellipse cx="24" cy="40" rx="5" ry="8" />
          <ellipse cx="10" cy="25" rx="8" ry="5" />
          <ellipse cx="38" cy="25" rx="8" ry="5" />
          <ellipse cx="14" cy="14" rx="5" ry="7" transform="rotate(-45 14 14)" />
          <ellipse cx="34" cy="14" rx="5" ry="7" transform="rotate(45 34 14)" />
          <ellipse cx="14" cy="36" rx="5" ry="7" transform="rotate(45 14 36)" />
          <ellipse cx="34" cy="36" rx="5" ry="7" transform="rotate(-45 34 36)" />
        </g>
        <circle cx="24" cy="25" r="5.5" fill="#fff" opacity="0.35" />
      </svg>
      <span
        className="font-bold leading-none tracking-tight"
        style={{
          fontFamily: 'Segoe UI, Calibri, Arial, sans-serif',
          fontSize: Math.round(iconSize * 0.62),
          color: '#003978',
        }}
      >
        <span style={{ fontSize: '0.92em' }}>e</span>
        <span>DF</span>
      </span>
    </div>
  )
}
