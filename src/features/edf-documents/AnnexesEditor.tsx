import type { Annex } from '../../types/edfDigitDocument'
import { createId } from '../../utils/id'
import { newTextBlock } from '../../utils/edfDocumentFactories'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { SectionBlocksEditor } from './SectionBlocksEditor'

export function AnnexesEditor({
  annexes,
  onChange,
}: {
  annexes: Annex[]
  onChange: (a: Annex[]) => void
}) {
  function patch(i: number, a: Annex) {
    onChange(annexes.map((x, j) => (j === i ? a : x)))
  }

  return (
    <div className="space-y-3">
      {annexes.map((ax, i) => (
        <div key={ax.id} className="border border-edf-border bg-edf-surface">
          <div className="flex items-center justify-between gap-2 border-b border-edf-border bg-edf-panel px-2 py-1">
            <span className="text-xs font-bold">Annexe {i + 1}</span>
            <Button
              variant="danger"
              className="text-[10px] px-1!"
              onClick={() => onChange(annexes.filter((_, j) => j !== i))}
            >
              Supprimer
            </Button>
          </div>
          <div className="p-2">
            <Label>Titre</Label>
            <Input
              value={ax.title}
              onChange={(e) =>
                patch(i, { ...ax, title: e.target.value })
              }
            />
          </div>
          <div className="p-2 pt-0">
            <SectionBlocksEditor
              blocks={ax.blocks}
              onChange={(blocks) => patch(i, { ...ax, blocks })}
            />
          </div>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          onChange([
            ...annexes,
            {
              id: createId(),
              title: 'Nouvelle annexe',
              blocks: [newTextBlock()],
            },
          ])
        }
      >
        + Annexe
      </Button>
    </div>
  )
}
