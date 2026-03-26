/**
 * Représentation simplifiée du signe EDF (bleu + rouge corporate) pour en-têtes UNITEP.
 * Le logo officiel doit être utilisé côté production selon la charte groupe.
 */
export function EdfLogoMark({
  className = '',
  size = 44,
}: {
  className?: string
  size?: number
}) {
  const h = Math.round(size * 1.14)
  return (
    <svg
      className={className}
      width={size}
      height={h}
      viewBox="0 0 40 46"
      aria-label="EDF"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#00539F"
        d="M20 2c8.5 0 15.5 6 17.5 14l-6.8 2.5C28.8 12 25.2 9 20 9c-5.5 0-10.2 3.5-11.8 8.5L2 14.5C4.8 6 11.8 2 20 2z"
      />
      <path
        fill="#E3000F"
        d="M20 44c-8.5 0-15.5-6-17.5-14l6.8-2.5c2.9 6.5 6.5 9.5 11.7 9.5 5.5 0 10.2-3.5 11.8-8.5l6.2 3C35.2 40 28.2 44 20 44z"
      />
    </svg>
  )
}
