import type { RevisionHistoryRow } from '../../types/edfDigitDocument'
import { newRevisionRow } from '../../utils/edfDocumentFactories'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'

export function RevisionHistoryEditor({
  rows,
  onChange,
}: {
  rows: RevisionHistoryRow[]
  onChange: (r: RevisionHistoryRow[]) => void
}) {
  function patch(i: number, p: Partial<RevisionHistoryRow>) {
    onChange(rows.map((row, j) => (j === i ? { ...row, ...p } : row)))
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto border border-edf-border">
        <table className="w-full min-w-[900px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-edf-border bg-edf-panel">
              <th className="px-1 py-1 text-left font-semibold">Indice</th>
              <th className="px-1 py-1 text-left font-semibold">Date</th>
              <th className="px-1 py-1 text-left font-semibold">
                Nature des évolutions
              </th>
              <th className="px-1 py-1 text-left font-semibold">Rédacteur</th>
              <th className="px-1 py-1 text-left font-semibold">
                Vérificateur
              </th>
              <th className="px-1 py-1 text-left font-semibold">Approbateur</th>
              <th className="w-px px-1 py-1" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className="border-b border-edf-border">
                <td className="p-0.5 align-top">
                  <Input
                    className="text-xs"
                    value={row.indice}
                    onChange={(e) => patch(i, { indice: e.target.value })}
                  />
                </td>
                <td className="p-0.5 align-top">
                  <Input
                    className="text-xs"
                    value={row.date}
                    onChange={(e) => patch(i, { date: e.target.value })}
                  />
                </td>
                <td className="p-0.5 align-top">
                  <Textarea
                    className="min-h-12 text-xs"
                    value={row.natureEvolution}
                    onChange={(e) =>
                      patch(i, { natureEvolution: e.target.value })
                    }
                  />
                </td>
                <td className="p-0.5 align-top">
                  <Input
                    className="text-xs"
                    value={row.redacteur}
                    onChange={(e) => patch(i, { redacteur: e.target.value })}
                  />
                </td>
                <td className="p-0.5 align-top">
                  <Input
                    className="text-xs"
                    value={row.verificateur}
                    onChange={(e) => patch(i, { verificateur: e.target.value })}
                  />
                </td>
                <td className="p-0.5 align-top">
                  <Input
                    className="text-xs"
                    value={row.approbateur}
                    onChange={(e) => patch(i, { approbateur: e.target.value })}
                  />
                </td>
                <td className="p-0.5 align-top">
                  <Button
                    variant="danger"
                    className="px-1! py-0.5! text-[10px]"
                    disabled={rows.length <= 1}
                    onClick={() =>
                      onChange(rows.filter((_, j) => j !== i))
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
        onClick={() => onChange([...rows, newRevisionRow()])}
      >
        + Ligne d’historique
      </Button>
    </div>
  )
}
