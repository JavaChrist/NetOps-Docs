import { useState } from 'react'
import type { DocumentSection } from '../../types/edfDigitDocument'
import { computeSectionNumbers } from '../../utils/sectionNumbering'
import { newSection, newTextBlock } from '../../utils/edfDocumentFactories'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { SectionBlocksEditor } from './SectionBlocksEditor'

export function SectionsEditor({
  sections,
  onChange,
}: {
  sections: DocumentSection[]
  onChange: (s: DocumentSection[]) => void
}) {
  const nums = computeSectionNumbers(sections)
  const [addLevel, setAddLevel] = useState<1 | 2 | 3>(1)

  function patchSection(i: number, sec: DocumentSection) {
    onChange(sections.map((x, j) => (j === i ? sec : x)))
  }

  function moveSection(i: number, d: -1 | 1) {
    const j = i + d
    if (j < 0 || j >= sections.length) return
    if (sections[i].sectionRole !== 'free' || sections[j].sectionRole !== 'free') {
      const a = sections[i].sectionRole
      const b = sections[j].sectionRole
      if (a !== 'free' || b !== 'free') return
    }
    const next = [...sections]
    const [x] = next.splice(i, 1)
    next.splice(j, 0, x)
    onChange(next)
  }

  function removeSection(i: number) {
    if (sections[i].sectionRole !== 'free') return
    onChange(sections.filter((_, j) => j !== i))
  }

  return (
    <div className="space-y-3">
      {sections.map((sec, i) => (
        <div
          key={sec.id}
          className="border-2 border-edf-border-strong bg-edf-surface"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edf-border bg-edf-panel px-2 py-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-edf-accent-dim">
                {nums[i]}
              </span>
              <span className="text-[11px] text-edf-muted">
                {sec.sectionRole !== 'free' ? '(obligatoire)' : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                className="px-1! py-0.5!"
                disabled={i === 0 || sec.sectionRole !== 'free'}
                onClick={() => moveSection(i, -1)}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                className="px-1! py-0.5!"
                disabled={
                  i === sections.length - 1 || sec.sectionRole !== 'free'
                }
                onClick={() => moveSection(i, 1)}
              >
                ↓
              </Button>
              <Button
                variant="danger"
                className="px-1! py-0.5! text-[10px]"
                disabled={sec.sectionRole !== 'free'}
                onClick={() => removeSection(i)}
              >
                Suppr. section
              </Button>
            </div>
          </div>
          <div className="grid gap-2 p-2 sm:grid-cols-[100px_1fr]">
            <div>
              <Label>Niveau</Label>
              <Select
                value={String(sec.level)}
                disabled={sec.sectionRole !== 'free'}
                onChange={(e) =>
                  patchSection(i, {
                    ...sec,
                    level: Number(e.target.value) as 1 | 2 | 3,
                  })
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Select>
            </div>
            <div>
              <Label>Titre de section</Label>
              <Input
                value={sec.title}
                disabled={
                  sec.sectionRole === 'objet' || sec.sectionRole === 'perimetre'
                }
                onChange={(e) =>
                  patchSection(i, { ...sec, title: e.target.value })
                }
              />
            </div>
          </div>
          <div className="p-2 pt-0">
            <Label>Contenu structuré</Label>
            <SectionBlocksEditor
              blocks={sec.blocks}
              onChange={(blocks) => patchSection(i, { ...sec, blocks })}
            />
          </div>
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-2 border border-dashed border-edf-border p-2">
        <div>
          <Label>Niveau nouvelle section</Label>
          <Select
            value={String(addLevel)}
            onChange={(e) =>
              setAddLevel(Number(e.target.value) as 1 | 2 | 3)
            }
          >
            <option value="1">Niveau 1</option>
            <option value="2">Niveau 2</option>
            <option value="3">Niveau 3</option>
          </Select>
        </div>
        <Button
          variant="primary"
          onClick={() =>
            onChange([
              ...sections,
              newSection(addLevel, 'NOUVELLE SECTION', 'free', [newTextBlock()]),
            ])
          }
        >
          + Section libre
        </Button>
      </div>
    </div>
  )
}
