import type { DiffusionBlock, AccessibilityLevel } from '../../types/edfDigitDocument'
import { ACCESSIBILITY_DESCRIPTIONS } from '../../types/edfDigitDocument'
import { Label } from '../../components/ui/Label'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'

const LEVELS: AccessibilityLevel[] = [
  'LIBRE',
  'INTERNE',
  'LIMITE',
  'CONFIDENTIEL',
]

export function DiffusionEditor({
  diffusion,
  onChange,
}: {
  diffusion: DiffusionBlock
  onChange: (d: DiffusionBlock) => void
}) {
  const desc = ACCESSIBILITY_DESCRIPTIONS[diffusion.accessibilityLevel]

  return (
    <div className="grid gap-3">
      <div>
        <Label>Niveau d’accessibilité (diffusion)</Label>
        <Select
          value={diffusion.accessibilityLevel}
          onChange={(e) =>
            onChange({
              ...diffusion,
              accessibilityLevel: e.target.value as AccessibilityLevel,
            })
          }
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </div>
      <div className="border border-edf-border bg-edf-panel px-2 py-2 text-xs text-edf-heading">
        <span className="font-semibold">Description associée : </span>
        {desc}
      </div>
      <div>
        <Label>Liste de diffusion EDF</Label>
        <Textarea
          value={diffusion.edfDistributionList}
          onChange={(e) =>
            onChange({ ...diffusion, edfDistributionList: e.target.value })
          }
          placeholder="Une ligne par destinataire ou référence"
        />
      </div>
      <div>
        <Label>Liste de diffusion externe</Label>
        <Textarea
          value={diffusion.externalDistributionList}
          onChange={(e) =>
            onChange({
              ...diffusion,
              externalDistributionList: e.target.value,
            })
          }
        />
      </div>
    </div>
  )
}
