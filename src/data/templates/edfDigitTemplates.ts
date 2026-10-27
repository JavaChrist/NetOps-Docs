import type { EdfDigitDocument } from '../../types/edfDigitDocument'
import {
  createEmptyEdfDigitDocument,
  mergeDocumentTemplate,
  newActionIllustrationBlock,
  newActionIllustrationRow,
  newSection,
  newTextBlock,
} from '../../utils/edfDocumentFactories'

export interface EdfDigitTemplate {
  id: string
  name: string
  description: string
  apply: () => EdfDigitDocument
}

function baseTechProcedure(
  title: string,
  referencePrefix: string,
  extraSections: ReturnType<typeof newSection>[] = [],
): EdfDigitDocument {
  const empty = createEmptyEdfDigitDocument()
  return mergeDocumentTemplate(empty, {
    templateId: undefined,
    header: {
      title,
      reference: `${referencePrefix}-${new Date().toISOString().slice(0, 10)}`,
      indice: 'A',
      documentType: 'PROCÉDURE TECHNIQUE',
      summary: title,
      applicationScope: "Sites concernés — à préciser dans la section « PERIMETRE D'APPLICATION ».",
    },
    sections: [
      newSection(1, 'OBJET', 'objet', [
        newTextBlock(
          "Décrire l'objectif opérationnel de la procédure et le résultat attendu en termes d'exploitation ou de conformité.",
        ),
      ]),
      newSection(1, "PERIMETRE D'APPLICATION", 'perimetre', [
        newTextBlock(
          'Périmètre technique, organisationnel et géographique. Références de parc, VLAN, typologie matérielle.',
        ),
      ]),
      ...extraSections,
    ],
  })
}

const stepsCamFixe = (() => {
  const blk = newActionIllustrationBlock()
  blk.caption = 'Déroulé opérationnel — installation caméra fixe'
  blk.rows = [
    {
      ...newActionIllustrationRow(),
      actionText:
        'Contrôler le lot livré (référence caméra, accessoires de fixation, documentation).',
    },
    {
      ...newActionIllustrationRow(),
      actionText:
        "Monter la caméra à l'emplacement validé (orientation, dégagement, accès maintenance).",
    },
    {
      ...newActionIllustrationRow(),
      actionText:
        'Raccorder Ethernet / PoE ; vérifier alimentation et démarrage matériel.',
    },
    {
      ...newActionIllustrationRow(),
      actionText:
        "Accéder à l'interface web ; finaliser paramètres de base (fuseau, sécurité minimale).",
    },
  ]
  return blk
})()

export const EDF_DIGIT_TEMPLATES: EdfDigitTemplate[] = [
  {
    id: 'tpl-cam-fixe',
    name: 'Caméra Axis — fixe',
    description: 'Structure DIGIT avec tableau ACTION / ILLUSTRATION pour installation fixe.',
    apply: () =>
      baseTechProcedure(
        "Procédure — installation caméra Axis fixe",
        'PROC-DIGIT-AXIS-FIXE',
        [
          newSection(1, 'REFERENTIEL ET PREREQUIS', 'free', [
            newTextBlock(
              '- Plan d’implantation validé\n- Alimentation PoE ou adaptateur selon dossier\n- Poste d’administration et droits réseau',
            ),
          ]),
          newSection(2, 'Mise en œuvre', 'free', [stepsCamFixe]),
        ],
      ),
  },
  {
    id: 'tpl-cam-ptz',
    name: 'Caméra Axis — PTZ',
    description: 'Pose PTZ, tests mouvements, paramètres de base.',
    apply: () => {
      const blk = newActionIllustrationBlock()
      blk.caption = 'Déroulé — PTZ'
      blk.rows = [
        {
          ...newActionIllustrationRow(),
          actionText: 'Valider encombrement et courses mécaniques PTZ.',
        },
        {
          ...newActionIllustrationRow(),
          actionText: 'Fixation, câblage, mise sous tension.',
        },
        {
          ...newActionIllustrationRow(),
          actionText: 'Test mouvements / zoom depuis interface web.',
        },
      ]
      return baseTechProcedure(
        "Procédure — installation caméra Axis PTZ",
        'PROC-DIGIT-AXIS-PTZ',
        [
          newSection(1, 'REFERENTIEL ET PREREQUIS', 'free', [
            newTextBlock('Plans PTZ, alimentation, dégagement mécanique.'),
          ]),
          newSection(2, 'Mise en œuvre', 'free', [blk]),
        ],
      )
    },
  },
  {
    id: 'tpl-ip',
    name: 'Configuration réseau — adresses IP',
    description: 'Changement IPv4 caméra et/ou poste opérateur.',
    apply: () =>
      baseTechProcedure(
        "Procédure — paramétrage IPv4 (caméra / poste)",
        'PROC-DIGIT-NET-IP',
        [
          newSection(2, 'Préparation', 'free', [
            newTextBlock(
              'Relevé configuration actuelle ; plan IP validé ; fenêtre maintenance.',
            ),
          ]),
          newSection(2, 'Application et contrôles', 'free', [
            newActionIllustrationBlock(),
          ]),
        ],
      ),
  },
  {
    id: 'tpl-admin',
    name: 'Compte administrateur',
    description: 'Création / renouvellement compte admin sur équipement.',
    apply: () =>
      baseTechProcedure(
        'Procédure — compte administrateur équipement',
        'PROC-DIGIT-SEC-ADMIN',
        [
          newSection(2, 'Mise en œuvre', 'free', [
            newActionIllustrationBlock(),
          ]),
        ],
      ),
  },
  {
    id: 'tpl-firmware',
    name: 'Mise à jour firmware',
    description: 'Montée de version contrôlée.',
    apply: () =>
      baseTechProcedure(
        'Procédure — mise à jour firmware',
        'PROC-DIGIT-Maint-FW',
        [
          newSection(2, 'Mise à jour', 'free', [newActionIllustrationBlock()]),
        ],
      ),
  },
  {
    id: 'tpl-flux',
    name: 'Flux vidéo',
    description: 'Paramétrage profils et validation VMS.',
    apply: () =>
      baseTechProcedure(
        'Procédure — paramétrage des flux vidéo',
        'PROC-DIGIT-VID-FLUX',
        [
          newSection(2, 'Paramétrage', 'free', [newActionIllustrationBlock()]),
        ],
      ),
  },
]
