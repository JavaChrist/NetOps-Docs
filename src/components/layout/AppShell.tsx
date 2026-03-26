import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

export function AppShell({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col text-edf-text">
      <header className="border-b border-edf-border-strong bg-edf-panel">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-x-6 gap-y-2 px-3 py-2 lg:px-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link
              to="/"
              className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-tight text-edf-muted hover:text-edf-heading"
            >
              EDF&nbsp;/&nbsp;DIGIT
            </Link>
            {title ? (
              <>
                <span className="hidden text-edf-border sm:inline" aria-hidden>
                  /
                </span>
                <span className="min-w-0 truncate text-xs font-medium text-edf-heading">
                  {title}
                </span>
              </>
            ) : null}
          </div>
          <nav
            className="flex gap-px border border-edf-border bg-edf-surface"
            aria-label="Navigation principale"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-medium ${
                  isActive
                    ? 'bg-edf-navy text-white'
                    : 'text-edf-heading hover:bg-edf-panel'
                }`
              }
            >
              Documents
            </NavLink>
            <NavLink
              to="/documents/new"
              className={({ isActive }) =>
                `border-l border-edf-border px-3 py-1.5 text-xs font-medium ${
                  isActive
                    ? 'bg-edf-navy text-white'
                    : 'text-edf-heading hover:bg-edf-panel'
                }`
              }
            >
              Nouveau
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-3 py-3 lg:px-4">
        {children}
      </main>

      <footer className="border-t border-edf-border bg-edf-panel px-3 py-1.5 text-[11px] text-edf-muted lg:px-4">
        <div className="mx-auto max-w-[1400px]">
          Outil interne — modèle structuré DIGIT · brouillons locaux · JSON / HTML
          / DOCX
        </div>
      </footer>
    </div>
  )
}
