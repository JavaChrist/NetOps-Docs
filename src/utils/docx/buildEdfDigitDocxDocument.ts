import {
  BorderStyle,
  Document,
  FileChild,
  HeadingLevel,
  ImageRun,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertInchesToTwip,
} from 'docx'
import type {
  AccessibilityLevel,
  DocumentHeaderBlock,
  EdfDigitDocument,
  SectionBlock,
} from '../../types/edfDigitDocument'
import { ACCESSIBILITY_DESCRIPTIONS } from '../../types/edfDigitDocument'
import { computeSectionNumbers, formatSectionHeading } from '../sectionNumbering'
import {
  ACCESSIBILITY_LEVEL_LABEL,
  UNITEP_COPYRIGHT,
  UNITEP_DIRECTION_LINE,
  UNITEP_DTEO_ADDRESS,
  UNITEP_EDF_SA_LEGAL,
  UNITEP_FID_INSTRUCTIONS,
  UNITEP_METIERS,
  UNITEP_REVISION_NOTE,
} from '../unitEepTemplateCopy'

const ALL_ACCESS_LEVELS: AccessibilityLevel[] = [
  'LIBRE',
  'INTERNE',
  'LIMITE',
  'CONFIDENTIEL',
]
import {
  decodeDataUrlImage,
  getBitmapDimensions,
  scaleToMaxWidth,
} from './dataUrlImage'
import { PROCEDURE_DOCX_THEME as T } from './procedureDocxTheme'

const B = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
} as const

function cellPara(text: string, bold = false): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: T.fontBody,
        size: T.halfPt.small,
        bold,
        color: T.color.heading,
      }),
    ],
  })
}

function secondaryMetaTable(doc: EdfDigitDocument): Table {
  const h = doc.header
  const rows: [string, string][] = [
    ['Entité émettrice', h.issuingEntity],
    ['Résumé', h.summary],
    ['Documents associés', h.relatedDocuments],
    ['Type de document', h.documentType],
    ['Processus', h.process],
    ["Périmètre d'application", h.applicationScope],
    ["Date d'applicabilité", h.applicabilityDate],
  ]
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: B,
    columnWidths: [2800, 7200],
    rows: rows.map(
      ([k, v]) =>
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: 'ECEAE7', type: ShadingType.CLEAR },
              children: [cellPara(k, true)],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: v || '—',
                      font: T.fontBody,
                      size: T.halfPt.small,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
    ),
  })
}

function coverBlockDocx(h: DocumentHeaderBlock): Paragraph[] {
  const small = T.halfPt.small
  const tiny = Math.round(T.halfPt.small * 0.85)
  const p = (text: string, opt?: { bold?: boolean; color?: string; size?: number }) =>
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text,
          font: T.fontBody,
          size: opt?.size ?? small,
          bold: opt?.bold,
          color: opt?.color ?? T.color.heading,
        }),
      ],
    })
  const page = h.pageCount?.trim() ? h.pageCount : '?'
  const lines: Paragraph[] = [
    p('Document DIGIT Accessibilité :', { bold: true, color: T.color.navy }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: h.title || '—',
          font: T.fontBody,
          size: T.halfPt.body,
          bold: true,
        }),
      ],
    }),
    p(`Indice : ${h.indice || '—'}`),
    p(`Nb Pages : ${h.pageCount || '—'}`),
    p(`Nb Annexe(s) : ${h.annexCount || '—'}`),
    p(`Référence : ${h.reference || '—'}`),
    p(UNITEP_DTEO_ADDRESS, { bold: true, color: '000000' }),
    p(`Page 1 / ${page}`, { color: '444444' }),
    p(UNITEP_COPYRIGHT, { size: tiny, color: '222222' }),
    p(UNITEP_EDF_SA_LEGAL, { size: tiny, color: '222222' }),
    p(UNITEP_DIRECTION_LINE, { size: tiny, bold: true, color: '000000' }),
    p(UNITEP_METIERS, { bold: true, size: T.halfPt.body }),
  ]
  if (!h.isDigitDocument) {
    lines.splice(
      2,
      0,
      p('Document non marqué DIGIT dans l’en-tête éditable.', {
        size: tiny,
        color: '666666',
      }),
    )
  }
  return lines
}

function revisionTable(doc: EdfDigitDocument): Table {
  const head = new TableRow({
    children: [
      'Ind.',
      'Date',
      'Nature des dernières évolutions',
      'Rédacteur(s)',
      'Vérificateur(s)',
      'Approbateur',
    ].map(
      (t) =>
        new TableCell({
          shading: { fill: '003D6B', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: t,
                  bold: true,
                  color: 'FFFFFF',
                  font: T.fontBody,
                  size: T.halfPt.small,
                }),
              ],
            }),
          ],
        }),
    ),
  })
  const body = doc.revisionHistory.map(
    (r) =>
      new TableRow({
        children: [
          r.indice,
          r.date,
          r.natureEvolution,
          r.redacteur,
          r.verificateur,
          r.approbateur,
        ].map(
          (t) =>
            new TableCell({
              children: [cellPara(t || ' ')],
            }),
        ),
      }),
  )
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: B,
    rows: [head, ...body],
  })
}

async function imageParagraph(
  dataUrl: string,
): Promise<Paragraph | null> {
  const dec = decodeDataUrlImage(dataUrl)
  if (!dec) return null
  try {
    const d = await getBitmapDimensions(dataUrl)
    const { width, height } = scaleToMaxWidth(
      d.width,
      d.height,
      T.imageMaxWidthPx,
    )
    return new Paragraph({
      children: [
        new ImageRun({
          type: dec.type,
          data: dec.data,
          transformation: { width, height },
        }),
      ],
    })
  } catch {
    return null
  }
}

async function blocksToDocx(blocks: SectionBlock[]): Promise<FileChild[]> {
  const out: FileChild[] = []
  for (const b of blocks) {
    switch (b.type) {
      case 'text':
        out.push(
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: b.content || '—',
                font: T.fontBody,
                size: T.halfPt.body,
              }),
            ],
          }),
        )
        break
      case 'list':
        b.items.forEach((item, i) => {
          const prefix = b.ordered ? `${i + 1}. ` : '• '
          out.push(
            new Paragraph({
              spacing: { after: 40 },
              indent: { left: convertInchesToTwip(0.15) },
              children: [
                new TextRun({
                  text: `${prefix}${item}`,
                  font: T.fontBody,
                  size: T.halfPt.body,
                }),
              ],
            }),
          )
        })
        break
      case 'table': {
        const hr = new TableRow({
          children: b.headers.map(
            (h) =>
              new TableCell({
                shading: { fill: 'E0E0E0', type: ShadingType.CLEAR },
                children: [cellPara(h, true)],
              }),
          ),
        })
        const br = b.rows.map(
          (row) =>
            new TableRow({
              children: row.map(
                (c) =>
                  new TableCell({
                    children: [cellPara(c)],
                  }),
              ),
            }),
        )
        out.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: B, rows: [hr, ...br] }))
        break
      }
      case 'action_illustration': {
        const hdr = new TableRow({
          children: ['N°', 'ACTION A RÉALISER', 'ILLUSTRATION'].map(
            (t, i) =>
              new TableCell({
                shading: { fill: '003D6B', type: ShadingType.CLEAR },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: t,
                        bold: true,
                        color: 'FFFFFF',
                        size: T.halfPt.small,
                      }),
                    ],
                  }),
                ],
                width:
                  i === 0
                    ? { size: 8, type: WidthType.PERCENTAGE }
                    : i === 1
                      ? { size: 46, type: WidthType.PERCENTAGE }
                      : { size: 46, type: WidthType.PERCENTAGE },
              }),
          ),
        })
        const rws: TableRow[] = [hdr]
        let idx = 1
        for (const r of b.rows) {
          const actionText = `${r.actionText}${r.remark ? `\nRem. : ${r.remark}` : ''}`
          const imgPara = r.imageDataUrl
            ? (await imageParagraph(r.imageDataUrl)) ?? cellPara('(image)')
            : cellPara('—')
          rws.push(
            new TableRow({
              children: [
                new TableCell({ children: [cellPara(String(idx))] }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: actionText || '—',
                          font: T.fontBody,
                          size: T.halfPt.small,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({ children: [imgPara] }),
              ],
            }),
          )
          idx++
        }
        out.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: B,
            rows: rws,
          }),
        )
        break
      }
      case 'image': {
        if (b.imageDataUrl) {
          const p = await imageParagraph(b.imageDataUrl)
          if (p) out.push(p)
        }
        if (b.caption) out.push(cellPara(b.caption))
        break
      }
      case 'remark':
        out.push(
          new Paragraph({
            shading: {
              fill: b.variant === 'vigilance' ? 'FFF4E6' : 'F0F0F0',
              type: ShadingType.CLEAR,
            },
            border: {
              left: {
                style: BorderStyle.SINGLE,
                size: 12,
                color: T.color.accent,
              },
            },
            spacing: { before: 120, after: 120 },
            children: [
              new TextRun({
                text: `${b.variant === 'vigilance' ? 'Vigilance' : 'Remarque'} : `,
                bold: true,
                font: T.fontBody,
                size: T.halfPt.body,
              }),
              new TextRun({
                text: b.content || '—',
                font: T.fontBody,
                size: T.halfPt.body,
              }),
            ],
          }),
        )
        break
      default:
        break
    }
  }
  return out
}

export async function buildEdfDigitDocxDocument(
  doc: EdfDigitDocument,
): Promise<Document> {
  const children: FileChild[] = []
  const nums = computeSectionNumbers(doc.sections)

  children.push(...coverBlockDocx(doc.header))
  children.push(secondaryMetaTable(doc))
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'Historique des indices',
          bold: true,
          color: T.color.navy,
          size: T.halfPt.sectionTitle,
        }),
      ],
    }),
  )
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: UNITEP_REVISION_NOTE,
          italics: true,
          color: '555555',
          font: T.fontBody,
          size: T.halfPt.small,
        }),
      ],
    }),
  )
  children.push(revisionTable(doc))
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'Accessibilité du document',
          bold: true,
          color: T.color.navy,
          size: T.halfPt.sectionTitle,
        }),
      ],
    }),
  )
  children.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `${ACCESSIBILITY_LEVEL_LABEL[doc.diffusion.accessibilityLevel]} — niveau retenu pour la diffusion.`,
          font: T.fontBody,
          size: T.halfPt.small,
        }),
      ],
    }),
  )
  for (const lvl of ALL_ACCESS_LEVELS) {
    const cur = doc.diffusion.accessibilityLevel === lvl
    children.push(
      new Paragraph({
        shading: cur
          ? { fill: 'FFF8E6', type: ShadingType.CLEAR }
          : undefined,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `${ACCESSIBILITY_LEVEL_LABEL[lvl]} `,
            bold: true,
            color: T.color.navy,
            font: T.fontBody,
            size: T.halfPt.small,
          }),
          new TextRun({
            text: ACCESSIBILITY_DESCRIPTIONS[lvl],
            font: T.fontBody,
            size: T.halfPt.small,
          }),
        ],
      }),
    )
  }
  children.push(
    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({
          text: 'Liste de diffusion (à remplir en cas de diffusion restreinte)',
          bold: true,
          color: T.color.navy,
          font: T.fontBody,
          size: T.halfPt.small,
        }),
      ],
    }),
  )
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: B,
      columnWidths: [5000, 5000],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: 'E8E8E8', type: ShadingType.CLEAR },
              children: [
                cellPara(
                  'Destinataire(s) EDF (Nom/Prénom/Entité)',
                  true,
                ),
              ],
            }),
            new TableCell({
              shading: { fill: 'E8E8E8', type: ShadingType.CLEAR },
              children: [
                cellPara(
                  'Destinataire(s) externes EDF (Nom/Prénom/Société)',
                  true,
                ),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                cellPara(doc.diffusion.edfDistributionList || '—'),
              ],
            }),
            new TableCell({
              children: [
                cellPara(doc.diffusion.externalDistributionList || '—'),
              ],
            }),
          ],
        }),
      ],
    }),
  )
  children.push(
    new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [
        new TextRun({
          text: 'Rappel FID / DOCTEAM (modèle UNITEP)',
          bold: true,
          color: T.color.navy,
          font: T.fontBody,
          size: T.halfPt.small,
        }),
      ],
    }),
  )
  for (const line of UNITEP_FID_INSTRUCTIONS) {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: `• ${line}`,
            font: T.fontBody,
            size: Math.round(T.halfPt.small * 0.92),
            color: '333333',
          }),
        ],
      }),
    )
  }

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: 'Table des matières',
          bold: true,
          color: T.color.navy,
          size: T.halfPt.sectionTitle,
        }),
      ],
    }),
  )
  doc.sections.forEach((s, i) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formatSectionHeading(nums[i], s.title),
            font: T.fontBody,
            size: T.halfPt.small,
          }),
        ],
      }),
    )
  })
  doc.annexes.forEach((a, i) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Annexe ${i + 1} : ${a.title}`,
            font: T.fontBody,
            size: T.halfPt.small,
          }),
        ],
      }),
    )
  })

  for (let i = 0; i < doc.sections.length; i++) {
    const s = doc.sections[i]
    const hl =
      s.level === 1
        ? HeadingLevel.HEADING_1
        : s.level === 2
          ? HeadingLevel.HEADING_2
          : HeadingLevel.HEADING_3
    children.push(
      new Paragraph({
        heading: hl,
        spacing: { before: i === 0 ? 120 : 240, after: 120 },
        children: [
          new TextRun({
            text: formatSectionHeading(nums[i], s.title),
            bold: true,
            color: T.color.navy,
            size: T.halfPt.stepTitle,
          }),
        ],
      }),
    )
    children.push(...(await blocksToDocx(s.blocks)))
  }

  if (doc.annexes.length) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 140 },
        children: [
          new TextRun({
            text: 'Annexes',
            bold: true,
            color: T.color.navy,
            size: T.halfPt.sectionTitle,
          }),
        ],
      }),
    )
    for (let i = 0; i < doc.annexes.length; i++) {
      const a = doc.annexes[i]
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: `Annexe ${i + 1} : ${a.title}`,
              bold: true,
              size: T.halfPt.body,
            }),
          ],
        }),
      )
      children.push(...(await blocksToDocx(a.blocks)))
    }
  }

  return new Document({
    title: doc.header.title || 'Document DIGIT',
    creator: doc.header.issuingEntity || undefined,
    description: doc.header.summary || undefined,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.95),
              right: convertInchesToTwip(0.95),
            },
          },
        },
        children,
      },
    ],
  })
}
