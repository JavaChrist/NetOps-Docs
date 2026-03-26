import type { SelectHTMLAttributes } from 'react'

export function Select({ className = '', ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-sm border border-edf-border bg-edf-surface px-2 py-1.5 text-xs text-edf-heading focus:border-edf-focus focus:outline-none focus:ring-1 focus:ring-edf-focus ${className}`}
      {...rest}
    />
  )
}
