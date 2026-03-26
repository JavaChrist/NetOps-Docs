import type { HTMLAttributes, ReactNode } from 'react'

/** Conteneur de section type « panneau » : bordure nette, sans ombre. */
export function Card({
  children,
  className = '',
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`border border-edf-border bg-edf-surface ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-edf-border bg-edf-panel px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xs font-bold uppercase tracking-wide text-edf-heading">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-xs text-edf-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-2 shrink-0 sm:mt-0">{action}</div> : null}
    </div>
  )
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-3 py-3 ${className}`}>{children}</div>
}
