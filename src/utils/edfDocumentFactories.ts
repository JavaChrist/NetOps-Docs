import type {
  ActionIllustrationRow,
  Annex,
  BlockActionIllustration,
  BlockImage,
  BlockList,
  BlockRemark,
  BlockTable,
  BlockText,
  DiffusionBlock,
  DocumentHeaderBlock,
  DocumentSection,
  EdfDigitDocument,
  RevisionHistoryRow,
  SectionBlock,
} from '../types/edfDigitDocument'
import { createId } from './id'

export function nowIso(): string {
  return new Date().toISOString()
}

export function newRevisionRow(p?: Partial<Omit<RevisionHistoryRow, 'id'>>): RevisionHistoryRow {
  return {
    id: createId(),
    indice: p?.indice ?? 'A',
    date: p?.date ?? new Date().toISOString().slice(0, 10),
    natureEvolution: p?.natureEvolution ?? '',
    redacteur: p?.redacteur ?? '',
    verificateur: p?.verificateur ?? '',
    approbateur: p?.approbateur ?? '',
  }
}

export function newTextBlock(content = ''): BlockText {
  return { type: 'text', id: createId(), content }
}

export function newListBlock(): BlockList {
  return { type: 'list', id: createId(), ordered: false, items: [''] }
}

export function newTableBlock(colCount = 3): BlockTable {
  const headers = Array.from({ length: colCount }, (_, i) => `Colonne ${i + 1}`)
  return {
    type: 'table',
    id: createId(),
    headers,
    rows: [Array(colCount).fill('')],
  }
}

export function newActionIllustrationBlock(): BlockActionIllustration {
  return {
    type: 'action_illustration',
    id: createId(),
    caption: '',
    rows: [newActionIllustrationRow()],
  }
}

export function newActionIllustrationRow(): ActionIllustrationRow {
  return {
    id: createId(),
    actionText: '',
    imageDataUrl: null,
    remark: '',
  }
}

export function newImageBlock(): BlockImage {
  return { type: 'image', id: createId(), caption: '', imageDataUrl: null }
}

export function newRemarkBlock(
  variant: 'remarque' | 'vigilance' = 'vigilance',
): BlockRemark {
  return { type: 'remark', id: createId(), variant, content: '' }
}

export function newSection(
  level: 1 | 2 | 3,
  title: string,
  sectionRole: DocumentSection['sectionRole'],
  blocks: SectionBlock[] = [newTextBlock()],
): DocumentSection {
  return { id: createId(), level, title, sectionRole, blocks }
}

function defaultHeader(): DocumentHeaderBlock {
  return {
    logoPlaceholder: '',
    isDigitDocument: true,
    accessibility: 'INTERNE',
    title: '',
    reference: '',
    indice: 'A',
    pageCount: '',
    annexCount: '0',
    issuingEntity: '',
    summary: '',
    relatedDocuments: '',
    documentType: 'Procédure technique',
    process: '',
    applicationScope: '',
    applicabilityDate: '',
  }
}

function defaultDiffusion(accessibility: DocumentHeaderBlock['accessibility']): DiffusionBlock {
  return {
    accessibilityLevel: accessibility,
    edfDistributionList: '',
    externalDistributionList: '',
  }
}

export function createEmptyEdfDigitDocument(): EdfDigitDocument {
  const t = nowIso()
  const header = defaultHeader()
  return {
    id: createId(),
    createdAt: t,
    updatedAt: t,
    header,
    revisionHistory: [newRevisionRow()],
    diffusion: defaultDiffusion(header.accessibility),
    sections: [
      newSection(1, 'OBJET', 'objet', [newTextBlock()]),
      newSection(1, "PERIMETRE D'APPLICATION", 'perimetre', [newTextBlock()]),
    ],
    annexes: [],
  }
}

function cloneBlock(b: SectionBlock): SectionBlock {
  switch (b.type) {
    case 'text':
      return { ...b, id: createId() }
    case 'list':
      return { ...b, id: createId(), items: [...b.items] }
    case 'table':
      return {
        ...b,
        id: createId(),
        headers: [...b.headers],
        rows: b.rows.map((r) => [...r]),
      }
    case 'action_illustration':
      return {
        ...b,
        id: createId(),
        rows: b.rows.map((r) => ({
          ...r,
          id: createId(),
          imageDataUrl: r.imageDataUrl,
        })),
      }
    case 'image':
      return { ...b, id: createId(), imageDataUrl: b.imageDataUrl }
    case 'remark':
      return { ...b, id: createId() }
    default:
      return b
  }
}

function cloneSection(s: DocumentSection): DocumentSection {
  return {
    ...s,
    id: createId(),
    blocks: s.blocks.map(cloneBlock),
  }
}

function cloneAnnex(a: Annex): Annex {
  return { ...a, id: createId(), blocks: a.blocks.map(cloneBlock) }
}

export function duplicateEdfDigitDocument(src: EdfDigitDocument): EdfDigitDocument {
  const t = nowIso()
  return {
    ...src,
    id: createId(),
    createdAt: t,
    updatedAt: t,
    header: { ...src.header },
    revisionHistory: src.revisionHistory.map((r) => ({ ...r, id: createId() })),
    diffusion: { ...src.diffusion },
    sections: src.sections.map(cloneSection),
    annexes: src.annexes.map(cloneAnnex),
    templateId: undefined,
  }
}

/** Fusionne un document partiel (template) sur une base vide. */
export function mergeDocumentTemplate(
  base: EdfDigitDocument,
  patch: Partial<{
    header: Partial<DocumentHeaderBlock>
    revisionHistory: RevisionHistoryRow[]
    diffusion: Partial<DiffusionBlock>
    sections: DocumentSection[]
    annexes: Annex[]
    templateId: string | undefined
  }>,
): EdfDigitDocument {
  const t = nowIso()
  const merged: EdfDigitDocument = {
    ...base,
    updatedAt: t,
    header: { ...base.header, ...patch.header },
    revisionHistory: patch.revisionHistory
      ? patch.revisionHistory.map((r) =>
          'id' in r && r.id
            ? (r as RevisionHistoryRow)
            : newRevisionRow(r as Partial<Omit<RevisionHistoryRow, 'id'>>),
        )
      : base.revisionHistory,
    diffusion: patch.diffusion
      ? { ...base.diffusion, ...patch.diffusion }
      : base.diffusion,
    sections: patch.sections ? patch.sections.map(cloneSection) : base.sections,
    annexes: patch.annexes ? patch.annexes.map(cloneAnnex) : base.annexes,
    templateId: patch.templateId !== undefined ? patch.templateId : base.templateId,
  }
  merged.diffusion.accessibilityLevel = merged.header.accessibility
  return merged
}
