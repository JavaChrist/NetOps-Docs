/** Niveau d’accessibilité documentaire DIGIT / diffusion. */
export type AccessibilityLevel = 'LIBRE' | 'INTERNE' | 'LIMITE' | 'CONFIDENTIEL'

/** Textes réglementaires alignés sur le modèle UNITEP (DIGIT / diffusion). */
export const ACCESSIBILITY_DESCRIPTIONS: Record<AccessibilityLevel, string> = {
  LIBRE:
    "L'information peut être rendue publique à l'intérieur et hors de l'entreprise.",
  INTERNE:
    "L'information est destinée à être traitée au sein du périmètre de l'entreprise. Elle peut néanmoins être partagée avec des externes dès lors que l'accès à cette information leur est nécessaire dans le cadre de leur relation avec l'entreprise.",
  LIMITE:
    "L'accès de l'information est limité à des personnes (internes ou externes à l'entreprise), fonctions ou à un périmètre restreint lié à une activité, une mission ou un projet.",
  CONFIDENTIEL:
    "L'information n'est destinée qu'à des personnes (internes/externes à l'entreprise) nommément désignées (C3 non admis DOCTEAM).",
}

export interface DocumentHeaderBlock {
  /** Emplacement réservé au logo (URL, chemin ou clé — traitement ultérieur). */
  logoPlaceholder?: string
  isDigitDocument: boolean
  accessibility: AccessibilityLevel
  title: string
  reference: string
  /** Indice courant du document (ex. A, B, Rev. 2). */
  indice: string
  /** Saisi ou recalculé à l’export ; champ éditorial pour compatibilité brouillon. */
  pageCount: string
  annexCount: string
  issuingEntity: string
  summary: string
  relatedDocuments: string
  documentType: string
  process: string
  applicationScope: string
  applicabilityDate: string
}

export interface RevisionHistoryRow {
  id: string
  indice: string
  date: string
  natureEvolution: string
  redacteur: string
  verificateur: string
  approbateur: string
}

export interface DiffusionBlock {
  accessibilityLevel: AccessibilityLevel
  edfDistributionList: string
  externalDistributionList: string
}

export type SectionBlockType =
  | 'text'
  | 'list'
  | 'table'
  | 'action_illustration'
  | 'image'
  | 'remark'

export interface BlockText {
  type: 'text'
  id: string
  content: string
}

export interface BlockList {
  type: 'list'
  id: string
  ordered: boolean
  items: string[]
}

export interface BlockTable {
  type: 'table'
  id: string
  headers: string[]
  rows: string[][]
}

export interface ActionIllustrationRow {
  id: string
  actionText: string
  imageDataUrl: string | null
  remark: string
}

export interface BlockActionIllustration {
  type: 'action_illustration'
  id: string
  caption?: string
  rows: ActionIllustrationRow[]
}

export interface BlockImage {
  type: 'image'
  id: string
  caption: string
  imageDataUrl: string | null
}

export interface BlockRemark {
  type: 'remark'
  id: string
  variant: 'remarque' | 'vigilance'
  content: string
}

export type SectionBlock =
  | BlockText
  | BlockList
  | BlockTable
  | BlockActionIllustration
  | BlockImage
  | BlockRemark

/** Rôle de section obligatoire (non supprimable). */
export type SectionRole = 'objet' | 'perimetre' | 'free'

export interface DocumentSection {
  id: string
  level: 1 | 2 | 3
  title: string
  sectionRole: SectionRole
  blocks: SectionBlock[]
}

export interface Annex {
  id: string
  title: string
  blocks: SectionBlock[]
}

export interface EdfDigitDocument {
  id: string
  createdAt: string
  updatedAt: string
  header: DocumentHeaderBlock
  revisionHistory: RevisionHistoryRow[]
  diffusion: DiffusionBlock
  sections: DocumentSection[]
  annexes: Annex[]
  templateId?: string
}

export type ExportFormat = 'json' | 'html' | 'docx' | 'pdf'
