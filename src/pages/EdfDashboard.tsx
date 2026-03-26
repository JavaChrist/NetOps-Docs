import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { Button } from '../components/ui/Button'
import { useEdfDocuments } from '../features/edf-documents/edfDocumentsContext'

export function EdfDashboard() {
  const navigate = useNavigate()
  const { documents, duplicate, remove } = useEdfDocuments()

  return (
    <AppShell>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3 border-b border-edf-border pb-2">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-wide text-edf-heading">
            Générateur DIGIT / UNITEEP
          </h1>
          <p className="mt-0.5 text-xs text-edf-muted">
            Documents structurés — {documents.length} fiche(s)
          </p>
        </div>
        <Link to="/documents/new">
          <Button variant="primary">Nouveau document</Button>
        </Link>
      </div>

      <div className="overflow-x-auto border border-edf-border-strong bg-edf-surface">
        <table className="w-full min-w-[640px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-edf-border bg-edf-panel">
              <th className="px-2 py-2 font-semibold">Titre</th>
              <th className="px-2 py-2 font-semibold">Référence</th>
              <th className="px-2 py-2 font-semibold">Indice</th>
              <th className="px-2 py-2 font-semibold">Type</th>
              <th className="px-2 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr
                key={d.id}
                className="border-b border-edf-border hover:bg-edf-panel/50"
              >
                <td className="px-2 py-1.5">
                  <Link
                    to={`/documents/${d.id}`}
                    className="font-medium text-edf-navy hover:underline"
                  >
                    {d.header.title || 'Sans titre'}
                  </Link>
                </td>
                <td className="px-2 py-1.5 font-mono text-edf-muted">
                  {d.header.reference || '—'}
                </td>
                <td className="px-2 py-1.5">{d.header.indice}</td>
                <td className="px-2 py-1.5">{d.header.documentType}</td>
                <td className="px-2 py-1.5 text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    <Link to={`/documents/${d.id}`}>
                      <Button variant="secondary">Ouvrir</Button>
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const c = duplicate(d.id)
                        if (c) navigate(`/documents/${c.id}`)
                      }}
                    >
                      Copier
                    </Button>
                    <Button variant="danger" onClick={() => remove(d.id)}>
                      Suppr.
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
