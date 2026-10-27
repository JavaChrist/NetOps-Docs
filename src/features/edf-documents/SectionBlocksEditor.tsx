import { useState } from 'react'
import type { SectionBlock } from '../../types/edfDigitDocument'
import {
  newActionIllustrationBlock,
  newActionIllustrationRow,
  newImageBlock,
  newListBlock,
  newRemarkBlock,
  newTableBlock,
  newTextBlock,
} from '../../utils/edfDocumentFactories'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { ScreenshotUpload } from '../../components/media/ScreenshotUpload'

export function SectionBlocksEditor({
  blocks,
  onChange,
}: {
  blocks: SectionBlock[]
  onChange: (b: SectionBlock[]) => void
}) {
  const [addKind, setAddKind] = useState<string>('')

  function replaceAt(i: number, block: SectionBlock) {
    onChange(blocks.map((x, j) => (j === i ? block : x)))
  }

  function removeAt(i: number) {
    onChange(blocks.filter((_, j) => j !== i))
  }

  function move(i: number, d: -1 | 1) {
    const j = i + d
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    const [x] = next.splice(i, 1)
    next.splice(j, 0, x)
    onChange(next)
  }

  function addType(t: SectionBlock['type']) {
    setAddKind('')
    const next: SectionBlock =
      t === 'text'
        ? newTextBlock()
        : t === 'list'
          ? newListBlock()
          : t === 'table'
            ? newTableBlock(3)
            : t === 'action_illustration'
              ? newActionIllustrationBlock()
              : t === 'image'
                ? newImageBlock()
                : newRemarkBlock('vigilance')
    onChange([...blocks, next])
  }

  return (
    <div className="space-y-2 border border-dashed border-edf-border bg-edf-surface/30 p-2">
      {blocks.map((block, i) => (
        <div
          key={block.id}
          className="border border-edf-border bg-edf-surface p-2"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-1 border-b border-edf-border pb-1">
            <span className="font-mono text-[10px] font-bold text-edf-navy">
              {block.type}
            </span>
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                className="px-1! py-0.5! min-w-6"
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                className="px-1! py-0.5! min-w-6"
                disabled={i === blocks.length - 1}
                onClick={() => move(i, 1)}
              >
                ↓
              </Button>
              <Button
                variant="danger"
                className="px-1! py-0.5! text-[10px]"
                onClick={() => removeAt(i)}
              >
                Retirer bloc
              </Button>
            </div>
          </div>
          {block.type === 'text' ? (
            <Textarea
              value={block.content}
              onChange={(e) =>
                replaceAt(i, { ...block, content: e.target.value })
              }
            />
          ) : null}
          {block.type === 'list' ? (
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={block.ordered}
                  onChange={(e) =>
                    replaceAt(i, { ...block, ordered: e.target.checked })
                  }
                />
                Liste numérotée
              </label>
              <Textarea
                value={block.items.join('\n')}
                onChange={(e) =>
                  replaceAt(i, {
                    ...block,
                    items: e.target.value.split('\n'),
                  })
                }
              />
            </div>
          ) : null}
          {block.type === 'table' ? (
            <div className="space-y-2 text-xs">
              <div>
                <Label>En-têtes (séparés par |)</Label>
                <Input
                  value={block.headers.join(' | ')}
                  onChange={(e) =>
                    replaceAt(i, {
                      ...block,
                      headers: e.target.value.split('|').map((s) => s.trim()),
                    })
                  }
                />
              </div>
              <div>
                <Label>Lignes (une par ligne, colonnes séparées par |)</Label>
                <Textarea
                  className="min-h-20 font-mono text-[11px]"
                  value={block.rows.map((r) => r.join(' | ')).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n')
                    const nc = block.headers.length
                    replaceAt(i, {
                      ...block,
                      rows: lines.map((line) => {
                        const c = line.split('|').map((s) => s.trim())
                        while (c.length < nc) c.push('')
                        return c.slice(0, nc)
                      }),
                    })
                  }}
                />
              </div>
            </div>
          ) : null}
          {block.type === 'action_illustration' ? (
            <div className="space-y-2">
              <Input
                placeholder="Titre du tableau (optionnel)"
                value={block.caption ?? ''}
                onChange={(e) =>
                  replaceAt(i, { ...block, caption: e.target.value })
                }
              />
              <div className="overflow-x-auto border border-edf-border">
                <table className="w-full min-w-[520px] text-xs">
                  <thead>
                    <tr className="bg-edf-navy text-white">
                      <th className="w-8 px-1 py-1">N°</th>
                      <th className="px-1 py-1 text-left">
                        ACTION A RÉALISER
                      </th>
                      <th className="w-[200px] px-1 py-1">ILLUSTRATION</th>
                      <th className="px-1 py-1 text-left">Remarque</th>
                      <th className="w-px" />
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((r, ri) => (
                      <tr key={r.id} className="border-t border-edf-border">
                        <td className="align-top text-center font-mono">
                          {ri + 1}
                        </td>
                        <td className="align-top p-0.5">
                          <Textarea
                            className="min-h-16 text-xs"
                            value={r.actionText}
                            onChange={(e) => {
                              const rows = block.rows.map((x, j) =>
                                j === ri
                                  ? { ...x, actionText: e.target.value }
                                  : x,
                              )
                              replaceAt(i, { ...block, rows })
                            }}
                          />
                        </td>
                        <td className="align-top p-0.5">
                          <ScreenshotUpload
                            dataUrl={r.imageDataUrl}
                            onChange={(url) => {
                              const rows = block.rows.map((x, j) =>
                                j === ri ? { ...x, imageDataUrl: url } : x,
                              )
                              replaceAt(i, { ...block, rows })
                            }}
                          />
                        </td>
                        <td className="align-top p-0.5">
                          <Input
                            className="text-xs"
                            value={r.remark}
                            onChange={(e) => {
                              const rows = block.rows.map((x, j) =>
                                j === ri ? { ...x, remark: e.target.value } : x,
                              )
                              replaceAt(i, { ...block, rows })
                            }}
                          />
                        </td>
                        <td className="align-top">
                          <Button
                            variant="ghost"
                            className="px-1!"
                            disabled={block.rows.length <= 1}
                            onClick={() =>
                              replaceAt(i, {
                                ...block,
                                rows: block.rows.filter((_, j) => j !== ri),
                              })
                            }
                          >
                            ×
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  replaceAt(i, {
                    ...block,
                    rows: [...block.rows, newActionIllustrationRow()],
                  })
                }
              >
                + Ligne action / illustration
              </Button>
            </div>
          ) : null}
          {block.type === 'image' ? (
            <div className="space-y-1">
              <Input
                placeholder="Légende"
                value={block.caption}
                onChange={(e) =>
                  replaceAt(i, { ...block, caption: e.target.value })
                }
              />
              <ScreenshotUpload
                dataUrl={block.imageDataUrl}
                onChange={(url) =>
                  replaceAt(i, { ...block, imageDataUrl: url })
                }
              />
            </div>
          ) : null}
          {block.type === 'remark' ? (
            <div className="space-y-1">
              <Select
                value={block.variant}
                onChange={(e) =>
                  replaceAt(i, {
                    ...block,
                    variant: e.target.value as 'remarque' | 'vigilance',
                  })
                }
              >
                <option value="remarque">Remarque</option>
                <option value="vigilance">Vigilance</option>
              </Select>
              <Textarea
                value={block.content}
                onChange={(e) =>
                  replaceAt(i, { ...block, content: e.target.value })
                }
              />
            </div>
          ) : null}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-[11px] text-edf-muted">Ajouter :</span>
        <Select
          className="w-48"
          value={addKind}
          onChange={(e) => {
            const v = e.target.value as SectionBlock['type'] | ''
            if (v) addType(v)
            else setAddKind('')
          }}
        >
          <option value="">
            Type de bloc…
          </option>
          <option value="text">Texte</option>
          <option value="list">Liste</option>
          <option value="table">Tableau</option>
          <option value="action_illustration">ACTION / ILLUSTRATION</option>
          <option value="image">Image</option>
          <option value="remark">Remarque / vigilance</option>
        </Select>
      </div>
    </div>
  )
}
