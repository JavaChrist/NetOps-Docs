import type { ReactNode } from 'react'
import type { DocumentHeaderBlock, AccessibilityLevel } from '../../types/edfDigitDocument'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'

const LEVELS: AccessibilityLevel[] = [
  'LIBRE',
  'INTERNE',
  'LIMITE',
  'CONFIDENTIEL',
]

export function DocumentHeaderForm({
  header,
  onChange,
}: {
  header: DocumentHeaderBlock
  onChange: (h: DocumentHeaderBlock) => void
}) {
  function patch(p: Partial<DocumentHeaderBlock>) {
    onChange({ ...header, ...p })
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2 flex flex-wrap items-center gap-4 border border-edf-border bg-edf-panel px-2 py-2">
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={header.isDigitDocument}
            onChange={(e) => patch({ isDigitDocument: e.target.checked })}
          />
          Document DIGIT
        </label>
        <span className="text-[11px] text-edf-muted">
          Logo EDF : emplacement réservé (export / charte)
        </span>
      </div>
      <Field>
        <Label>Accessibilité documentaire</Label>
        <Select
          value={header.accessibility}
          onChange={(e) =>
            patch({ accessibility: e.target.value as AccessibilityLevel })
          }
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label>Titre du document</Label>
        <Input
          value={header.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <Field>
        <Label>Référence</Label>
        <Input
          value={header.reference}
          onChange={(e) => patch({ reference: e.target.value })}
        />
      </Field>
      <Field>
        <Label>Indice</Label>
        <Input
          value={header.indice}
          onChange={(e) => patch({ indice: e.target.value })}
        />
      </Field>
      <Field>
        <Label>Nombre de pages</Label>
        <Input
          value={header.pageCount}
          onChange={(e) => patch({ pageCount: e.target.value })}
          placeholder="Saisie ou calcul export"
        />
      </Field>
      <Field>
        <Label>Nombre d’annexes</Label>
        <Input
          value={header.annexCount}
          onChange={(e) => patch({ annexCount: e.target.value })}
        />
      </Field>
      <Field className="md:col-span-2">
        <Label>Entité émettrice</Label>
        <Input
          value={header.issuingEntity}
          onChange={(e) => patch({ issuingEntity: e.target.value })}
        />
      </Field>
      <Field className="md:col-span-2">
        <Label>Résumé</Label>
        <Textarea
          value={header.summary}
          onChange={(e) => patch({ summary: e.target.value })}
        />
      </Field>
      <Field className="md:col-span-2">
        <Label>Documents associés</Label>
        <Textarea
          value={header.relatedDocuments}
          onChange={(e) => patch({ relatedDocuments: e.target.value })}
        />
      </Field>
      <Field>
        <Label>Type de document</Label>
        <Input
          value={header.documentType}
          onChange={(e) => patch({ documentType: e.target.value })}
        />
      </Field>
      <Field>
        <Label>Processus</Label>
        <Input
          value={header.process}
          onChange={(e) => patch({ process: e.target.value })}
        />
      </Field>
      <Field className="md:col-span-2">
        <Label>Périmètre d’application (en-tête)</Label>
        <Textarea
          value={header.applicationScope}
          onChange={(e) => patch({ applicationScope: e.target.value })}
        />
      </Field>
      <Field>
        <Label>Date d’applicabilité</Label>
        <Input
          type="text"
          value={header.applicabilityDate}
          onChange={(e) => patch({ applicabilityDate: e.target.value })}
          placeholder="JJ/MM/AAAA ou libellé"
        />
      </Field>
    </div>
  )
}

function Field({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}
