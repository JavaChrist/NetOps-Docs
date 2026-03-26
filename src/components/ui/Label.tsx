import type { LabelHTMLAttributes, ReactNode } from 'react'

export function Label({
  children,
  className = '',
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label
      className={`mb-0.5 block text-xs font-medium text-edf-heading ${className}`}
      {...rest}
    >
      {children}
    </label>
  )
}
