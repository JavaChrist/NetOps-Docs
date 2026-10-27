import {
  AlignmentType,
  BorderStyle,
  Document,
  FileChild,
  Footer,
  Header,
  HeadingLevel,
  HeightRule,
  ImageRun,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlignTable,
  VerticalMergeType,
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
import {
  EDF_LOGO_PNG_DATA_URL,
  EDF_LOGO_PNG_HEIGHT,
  EDF_LOGO_PNG_WIDTH,
} from '../edfLogoAsset'

const B = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
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
    ['Résumé', h.summary],
    ['Documents associés', h.relatedDocuments],
  ]
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: B,
    columnWidths: [2200, 7800],
    rows: rows.map(
      ([k, v]) =>
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: 'FFFFFF', type: ShadingType.CLEAR },
              children: [cellPara(k, false)],
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

function inlineFieldParagraphs(h: DocumentHeaderBlock): Paragraph[] {
  const fields: [string, string][] = [
    ['Type', h.documentType],
    ['Processus', h.process],
    ["Périmètre d'application", h.applicationScope],
    ["Date d'applicabilité", h.applicabilityDate],
  ]
  return fields.map(
    ([k, v]) =>
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: `${k} : ${v || '—'}`,
            font: T.fontBody,
            size: T.halfPt.small,
            color: '000000',
          }),
        ],
      }),
  )
}

const UNITEP_ORANGE_TITLE = 'C65911'

const coverCell = {
  shading: { fill: 'FFFFFF', type: ShadingType.CLEAR },
  borders: B,
} as const

const NO = {
  style: BorderStyle.NONE,
  size: 0,
  color: 'FFFFFF',
} as const

const borderlessTable = {
  top: NO,
  bottom: NO,
  left: NO,
  right: NO,
  insideHorizontal: NO,
  insideVertical: NO,
} as const

const cellBorderNone = {
  top: NO,
  bottom: NO,
  left: NO,
  right: NO,
} as const

function coverBlockDocx(h: DocumentHeaderBlock): (Paragraph | Table)[] {
  const small = T.halfPt.small
  const tiny = Math.round(T.halfPt.small * 0.85)
  const bodySize = T.halfPt.body

  const logoDecoded = decodeDataUrlImage(EDF_LOGO_PNG_DATA_URL)
  const logoDisplayWidth = 96
  const logoDisplayHeight = Math.round(
    (EDF_LOGO_PNG_HEIGHT / EDF_LOGO_PNG_WIDTH) * logoDisplayWidth,
  )
  const logoParagraph = logoDecoded
    ? new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            type: logoDecoded.type,
            data: logoDecoded.data,
            transformation: {
              width: logoDisplayWidth,
              height: logoDisplayHeight,
            },
          }),
        ],
      })
    : new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'edf',
            font: T.fontBody,
            bold: true,
            size: bodySize,
            color: '003978',
          }),
        ],
      })

  const titleChildren: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: !h.isDigitDocument ? 40 : 80 },
      children: [
        new TextRun({
          text: h.title || '—',
          bold: true,
          color: '000000',
          font: T.fontBody,
          size: bodySize,
        }),
      ],
    }),
  ]
  if (!h.isDigitDocument) {
    titleChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'Document non marqué DIGIT dans l’en-tête éditable.',
            font: T.fontBody,
            size: tiny,
            color: '666666',
            italics: true,
          }),
        ],
      }),
    )
  }

  const metaLines = [
    `Indice : ${h.indice || '—'}`,
    `Nb Pages : ${h.pageCount || '—'}`,
    `Nb Annexe(s) : ${h.annexCount || '—'}`,
  ]
  const metaParas = metaLines.map(
    (line, i) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: i < metaLines.length - 1 ? 40 : 0 },
        children: [
          new TextRun({
            text: line,
            font: T.fontBody,
            size: small,
            color: '000000',
          }),
        ],
      }),
  )

  const rowLabels = new TableRow({
    children: [
      new TableCell({
        shading: { fill: 'FFFFFF', type: ShadingType.CLEAR },
        borders: cellBorderNone,
        width: { size: 22, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'Document DIGIT',
                font: T.fontBody,
                size: small,
                color: '000000',
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        shading: { fill: 'FFFFFF', type: ShadingType.CLEAR },
        borders: cellBorderNone,
        width: { size: 56, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'Accessibilité :',
                font: T.fontBody,
                size: small,
                color: '000000',
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        shading: { fill: 'FFFFFF', type: ShadingType.CLEAR },
        borders: cellBorderNone,
        width: { size: 22, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ spacing: { after: 40 } })],
      }),
    ],
  })

  const labelStrip = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: borderlessTable,
    rows: [rowLabels],
  })

  const rowTop = new TableRow({
    height: { value: 1100, rule: HeightRule.ATLEAST },
    children: [
      new TableCell({
        ...coverCell,
        verticalAlign: VerticalAlignTable.CENTER,
        verticalMerge: VerticalMergeType.RESTART,
        width: { size: 22, type: WidthType.PERCENTAGE },
        children: [logoParagraph],
      }),
      new TableCell({
        ...coverCell,
        verticalAlign: VerticalAlignTable.CENTER,
        width: { size: 56, type: WidthType.PERCENTAGE },
        children: titleChildren,
      }),
      new TableCell({
        ...coverCell,
        verticalAlign: VerticalAlignTable.CENTER,
        verticalMerge: VerticalMergeType.RESTART,
        width: { size: 22, type: WidthType.PERCENTAGE },
        children: metaParas,
      }),
    ],
  })

  const rowRef = new TableRow({
    height: { value: 420, rule: HeightRule.ATLEAST },
    children: [
      new TableCell({
        ...coverCell,
        verticalMerge: VerticalMergeType.CONTINUE,
        children: [new Paragraph({})],
      }),
      new TableCell({
        ...coverCell,
        verticalAlign: VerticalAlignTable.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Référence : ${h.reference || '—'}`,
                font: T.fontBody,
                size: tiny,
                color: '000000',
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        ...coverCell,
        verticalMerge: VerticalMergeType.CONTINUE,
        children: [new Paragraph({})],
      }),
    ],
  })

  const coverGrid = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: B,
    rows: [rowTop, rowRef],
  })

  const directionParagraph = new Paragraph({
    spacing: { before: 160, after: 120 },
    children: [
      new TextRun({
        text: `${UNITEP_DIRECTION_LINE} ${UNITEP_METIERS} `,
        font: T.fontBody,
        size: small,
        bold: true,
        color: '000000',
        allCaps: true,
      }),
      new TextRun({
        text: `Entité émettrice : ${h.issuingEntity || '—'}`,
        font: T.fontBody,
        size: small,
        color: '000000',
      }),
    ],
  })

  return [labelStrip, coverGrid, directionParagraph]
}

function coverFooterDocx(h: DocumentHeaderBlock): (Paragraph | Table)[] {
  const small = T.halfPt.small
  const tiny = Math.round(T.halfPt.small * 0.85)
  const page = h.pageCount?.trim() ? h.pageCount : '?'
  const logoDecoded = decodeDataUrlImage(EDF_LOGO_PNG_DATA_URL)
  const logoDisplayWidth = 64
  const logoDisplayHeight = Math.round(
    (EDF_LOGO_PNG_HEIGHT / EDF_LOGO_PNG_WIDTH) * logoDisplayWidth,
  )

  const logoRow = new TableRow({
    children: [
      new TableCell({
        borders: cellBorderNone,
        width: { size: 15, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlignTable.CENTER,
        children: logoDecoded
          ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    type: logoDecoded.type,
                    data: logoDecoded.data,
                    transformation: {
                      width: logoDisplayWidth,
                      height: logoDisplayHeight,
                    }
                  }),
                ],
              }),
            ]
          : [new Paragraph({})],
      }),
      new TableCell({
        borders: cellBorderNone,
        width: { size: 85, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlignTable.CENTER,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: UNITEP_DTEO_ADDRESS,
                font: T.fontBody,
                size: small,
                bold: true,
                color: '000000',
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: borderlessTable,
    rows: [logoRow],
  })

  return [
    footerTable,
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: `Page 1 / ${page}`,
          font: T.fontBody,
          size: small,
          color: '444444',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: UNITEP_COPYRIGHT,
          font: T.fontBody,
          size: tiny,
          color: '222222',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: UNITEP_EDF_SA_LEGAL,
          font: T.fontBody,
          size: tiny,
          color: '222222',
        }),
      ],
    }),
  ]
}

function defaultHeaderDocx(h: DocumentHeaderBlock): (Paragraph | Table)[] {
  const small = T.halfPt.small
  const tiny = Math.round(T.halfPt.small * 0.85)
  return [
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: 'Document DIGIT  Accessibilité : ',
          bold: true,
          color: '00539F',
          font: T.fontBody,
          size: tiny,
        }),
        new TextRun({
          text: h.title || '—',
          bold: true,
          color: '000000',
          font: T.fontBody,
          size: small,
        }),
      ],
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: '000000',
          space: 2,
        },
      },
    }),
  ]
}

function defaultFooterDocx(h: DocumentHeaderBlock): (Paragraph | Table)[] {
  const tiny = Math.round(T.halfPt.small * 0.85)
  const totalPages = h.pageCount?.trim() ? h.pageCount : ''
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 40 },
      border: {
        top: {
          style: BorderStyle.SINGLE,
          size: 4,
          color: '000000',
          space: 2,
        },
      },
      children: [
        new TextRun({
          text: 'Page ',
          font: T.fontBody,
          size: tiny,
          color: '333333',
        }),
        new TextRun({
          children: [PageNumber.CURRENT],
          font: T.fontBody,
          size: tiny,
          color: '333333',
        }),
        new TextRun({
          text: ' / ',
          font: T.fontBody,
          size: tiny,
          color: '333333',
        }),
        ...(totalPages
          ? [
              new TextRun({
                text: totalPages,
                font: T.fontBody,
                size: tiny,
                color: '333333',
              }),
            ]
          : [
              new TextRun({
                children: [PageNumber.TOTAL_PAGES],
                font: T.fontBody,
                size: tiny,
                color: '333333',
              }),
            ]),
        new TextRun({
          text: `    Référence : ${h.reference || '—'}`,
          font: T.fontBody,
          size: tiny,
          color: '333333',
        }),
      ],
    }),
  ]
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
          shading: { fill: UNITEP_ORANGE_TITLE, type: ShadingType.CLEAR },
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
                shading: { fill: UNITEP_ORANGE_TITLE, type: ShadingType.CLEAR },
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

  children.push(secondaryMetaTable(doc))
  children.push(...inlineFieldParagraphs(doc.header))
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'Historique des indices',
          bold: true,
          color: UNITEP_ORANGE_TITLE,
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
          color: UNITEP_ORANGE_TITLE,
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
            color: UNITEP_ORANGE_TITLE,
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
          color: UNITEP_ORANGE_TITLE,
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
          color: UNITEP_ORANGE_TITLE,
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
          color: UNITEP_ORANGE_TITLE,
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
            color: UNITEP_ORANGE_TITLE,
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
            color: UNITEP_ORANGE_TITLE,
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
            color: UNITEP_ORANGE_TITLE,
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
            color: UNITEP_ORANGE_TITLE,
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
              color: UNITEP_ORANGE_TITLE,
              size: T.halfPt.body,
            }),
          ],
        }),
      )
      children.push(...(await blocksToDocx(a.blocks)))
    }
  }

  const firstHeader = new Header({ children: coverBlockDocx(doc.header) })
  const firstFooter = new Footer({ children: coverFooterDocx(doc.header) })
  const mainHeader = new Header({ children: defaultHeaderDocx(doc.header) })
  const mainFooter = new Footer({ children: defaultFooterDocx(doc.header) })

  return new Document({
    title: doc.header.title || 'Document DIGIT',
    creator: doc.header.issuingEntity || undefined,
    description: doc.header.summary || undefined,
    sections: [
      {
        properties: {
          titlePage: true,
          page: {
            margin: {
              top: convertInchesToTwip(1.05),
              bottom: convertInchesToTwip(1.2),
              left: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              header: convertInchesToTwip(0.35),
              footer: convertInchesToTwip(0.35),
            },
          },
        },
        headers: {
          default: mainHeader,
          first: firstHeader,
        },
        footers: {
          default: mainFooter,
          first: firstFooter,
        },
        children,
      },
    ],
  })
}
