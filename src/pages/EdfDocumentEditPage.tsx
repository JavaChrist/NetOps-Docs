import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EdfDigitPreview } from '../components/preview/EdfDigitPreview'
import { DocumentHeaderForm } from '../features/edf-documents/DocumentHeaderForm'
import { RevisionHistoryEditor } from '../features/edf-documents/RevisionHistoryEditor'
import { DiffusionEditor } from '../features/edf-documents/DiffusionEditor'
import { SectionsEditor } from '../features/edf-documents/SectionsEditor'
import { AnnexesEditor } from '../features/edf-documents/AnnexesEditor'
import { useEdfDocuments } from '../features/edf-documents/edfDocumentsContext'
import type { EdfDigitDocument } from '../types/edfDigitDocument'
import {
  buildEdfDigitHtmlDocument,
  exportEdfDigitJson,
} from '../utils/exportEdfDigit'
import { downloadBlob, downloadBlobFile } from '../utils/export'

type Tab = 'edit' | 'preview'

export function EdfDocumentEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getById, update, remove, duplicate } = useEdfDocuments()
  const [tab, setTab] = useState<Tab>('edit')
  const [docxBusy, setDocxBusy] = useState(false)
  const [docxErr, setDocxErr] = useState<string | null>(null)

  const doc = id ? getById(id) : undefined
  const title = useMemo(
    () => doc?.header.title || 'Document DIGIT',
    [doc?.header.title],
  )

  if (!id || !doc) {
    return (
      <AppShell>
        <p className="text-xs text-edf-muted">Document introuvable.</p>
        <Link to="/" className="mt-3 inline-block">
          <Button variant="secondary">Retour</Button>
        </Link>
      </AppShell>
    )
  }

  const current = doc

  function commit(next: EdfDigitDocument) {
    if (next.header.accessibility !== current.header.accessibility) {
      next = {
        ...next,
        diffusion: {
          ...next.diffusion,
          accessibilityLevel: next.header.accessibility,
        },
      }
    }
    update(next)
  }

  function patchHeader(header: EdfDigitDocument['header']) {
    commit({
      ...current,
      header,
      diffusion: {
        ...current.diffusion,
        accessibilityLevel: header.accessibility,
      },
    })
  }

  function safeName() {
    return (current.header.title || 'document').replace(/[^\w-]+/g, '_')
  }

  function doJson() {
    downloadBlob(
      `${safeName()}.json`,
      exportEdfDigitJson(current),
      'application/json',
    )
  }

  function doHtml() {
    downloadBlob(
      `${safeName()}.html`,
      buildEdfDigitHtmlDocument(current),
      'text/html;charset=utf-8',
    )
  }

  async function doDocx() {
    setDocxErr(null)
    setDocxBusy(true)
    try {
      const { exportEdfDigitDocxBlob } = await import('../utils/docx')
      const blob = await exportEdfDigitDocxBlob(current)
      downloadBlobFile(`${safeName()}.docx`, blob)
    } catch (e) {
      setDocxErr(e instanceof Error ? e.message : 'Export DOCX impossible')
    } finally {
      setDocxBusy(false)
    }
  }

  return (
    <AppShell title={title}>
      <div className="mb-3 flex flex-col gap-2 border-b border-edf-border pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          <TabBtn active={tab === 'edit'} onClick={() => setTab('edit')}>
            Édition structurée
          </TabBtn>
          <TabBtn active={tab === 'preview'} onClick={() => setTab('preview')}>
            Aperçu document
          </TabBtn>
        </div>
        <div className="flex flex-wrap gap-1">
          <Button variant="secondary" onClick={doJson}>
            JSON
          </Button>
          <Button variant="secondary" onClick={doHtml}>
            HTML
          </Button>
          <Button
            variant="primary"
            disabled={docxBusy}
            onClick={() => void doDocx()}
          >
            {docxBusy ? 'DOCX…' : 'DOCX'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const c = duplicate(current.id)
              if (c) navigate(`/documents/${c.id}`)
            }}
          >
            Dupliquer
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Supprimer ce document ?')) {
                remove(current.id)
                navigate('/')
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      </div>

      {docxErr ? (
        <p className="mb-2 border border-red-700/40 bg-red-50 px-2 py-1 text-xs text-red-900">
          {docxErr}
        </p>
      ) : null}

      {tab === 'preview' ? (
        <EdfDigitPreview doc={current} />
      ) : (
        <div className="space-y-3">
          <Card>
            <CardHeader title="1. En-tête documentaire (bloc normé)" />
            <CardBody>
              <DocumentHeaderForm
                header={current.header}
                onChange={patchHeader}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="2. Historique des indices" />
            <CardBody>
              <RevisionHistoryEditor
                rows={current.revisionHistory}
                onChange={(rows) =>
                  commit({ ...current, revisionHistory: rows })
                }
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="3. Accessibilité & diffusion" />
            <CardBody>
              <DiffusionEditor
                diffusion={current.diffusion}
                onChange={(diffusion) =>
                  commit({
                    ...current,
                    diffusion,
                    header: {
                      ...current.header,
                      accessibility: diffusion.accessibilityLevel,
                    },
                  })
                }
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="4. Corps — sections hiérarchiques & blocs" />
            <CardBody>
              <p className="mb-2 text-[11px] text-edf-muted">
                Sections obligatoires : OBJET et PERIMETRE D&apos;APPLICATION (non
                supprimables). Sommaire calculé automatiquement à l&apos;aperçu /
                export.
              </p>
              <SectionsEditor
                sections={current.sections}
                onChange={(sections) => commit({ ...current, sections })}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="5. Annexes" />
            <CardBody>
              <AnnexesEditor
                annexes={current.annexes}
                onChange={(annexes) => commit({ ...current, annexes })}
              />
            </CardBody>
          </Card>
        </div>
      )}
    </AppShell>
  )
}

function TabBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-2 py-1 text-xs font-medium ${
        active
          ? 'border-edf-border-strong bg-edf-surface text-edf-heading'
          : 'border-transparent text-edf-muted hover:border-edf-border hover:bg-edf-panel'
      }`}
    >
      {children}
    </button>
  )
}
