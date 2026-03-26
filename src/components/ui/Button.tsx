import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const variants: Record<Variant, string> = {
  primary:
    'bg-edf-navy text-white border border-edf-navy hover:bg-[#004a7a] focus-visible:ring-edf-focus',
  secondary:
    'bg-edf-surface text-edf-heading border border-edf-border hover:bg-edf-panel focus-visible:ring-edf-focus',
  danger:
    'bg-edf-surface text-red-800 border border-red-700/50 hover:bg-red-50 focus-visible:ring-red-700',
  ghost:
    'bg-transparent text-edf-heading border border-transparent hover:bg-edf-panel hover:border-edf-border',
}

export function Button({
  variant = 'secondary',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-edf-bg disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
