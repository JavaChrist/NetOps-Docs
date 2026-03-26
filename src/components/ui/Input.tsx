import type { InputHTMLAttributes } from 'react'

export function Input({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-sm border border-edf-border bg-edf-surface px-2 py-1.5 text-xs text-edf-heading placeholder:text-edf-muted/60 focus:border-edf-focus focus:outline-none focus:ring-1 focus:ring-edf-focus ${className}`}
      {...rest}
    />
  )
}
