import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EDF_DIGIT_TEMPLATES } from '../data/templates/edfDigitTemplates'
import { useEdfDocuments } from '../features/edf-documents/edfDocumentsContext'
export function NewEdfDocumentPage() {
  const navigate = useNavigate()
  const { add, addEmpty } = useEdfDocuments()

  return (
    <AppShell title="Nouveau document">
      <div className="mb-3 border-b border-edf-border pb-2">
        <h1 className="text-sm font-bold uppercase text-edf-heading">
          Nouveau document structuré
        </h1>
        <p className="mt-0.5 text-xs text-edf-muted">
          Modèles métier ou document minimal (en-tête + historique + sections
          obligatoires).
        </p>
      </div>

      <Card className="mb-3">
        <CardHeader title="Modèles" />
        <CardBody className="p-0">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-edf-border bg-edf-panel">
                <th className="px-2 py-2 font-semibold">Modèle</th>
                <th className="px-2 py-2 font-semibold">Description</th>
                <th className="w-px px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {EDF_DIGIT_TEMPLATES.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-edf-border hover:bg-edf-panel/40"
                >
                  <td className="px-2 py-1.5 font-medium">{t.name}</td>
                  <td className="px-2 py-1.5 text-edf-muted">{t.description}</td>
                  <td className="px-2 py-1.5 text-right">
                    <Button
                      variant="primary"
                      onClick={() => {
                        const d = t.apply()
                        add({ ...d, templateId: t.id })
                        navigate(`/documents/${d.id}`)
                      }}
                    >
                      Appliquer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Document minimal"
          description="Blocs obligatoires vierges, sans contenu métier prérempli."
        />
        <CardBody>
          <Button
            variant="secondary"
            onClick={() => {
              const d = addEmpty()
              navigate(`/documents/${d.id}`)
            }}
          >
            Créer
          </Button>
        </CardBody>
      </Card>
    </AppShell>
  )
}
