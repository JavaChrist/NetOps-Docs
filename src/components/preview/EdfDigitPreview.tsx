import type {
  AccessibilityLevel,
  ActionIllustrationRow,
  BlockTable,
  EdfDigitDocument,
  SectionBlock,
} from '../../types/edfDigitDocument'
import { ACCESSIBILITY_DESCRIPTIONS } from '../../types/edfDigitDocument'
import {
  computeSectionNumbers,
  formatSectionHeading,
} from '../../utils/sectionNumbering'
import {
  ACCESSIBILITY_LEVEL_LABEL,
  UNITEP_COPYRIGHT,
  UNITEP_DIRECTION_LINE,
  UNITEP_DTEO_ADDRESS,
  UNITEP_EDF_SA_LEGAL,
  UNITEP_FID_INSTRUCTIONS,
  UNITEP_METIERS,
  UNITEP_REVISION_NOTE,
} from '../../utils/unitEepTemplateCopy'
import { UNITEP_THEME as U } from '../../utils/unitEepTheme'
import { EdfHeaderLogoLockup } from '../branding/EdfHeaderLogoLockup'

const ALL_ACCESS_LEVELS: AccessibilityLevel[] = [
  'LIBRE',
  'INTERNE',
  'LIMITE',
  'CONFIDENTIEL',
]

export function EdfDigitPreview({ doc }: { doc: EdfDigitDocument }) {
  const nums = computeSectionNumbers(doc.sections)
  const h = doc.header

  const secondaryRows: [string, string][] = [
    ['Entité émettrice', h.issuingEntity],
    ['Résumé', h.summary],
    ['Documents associés', h.relatedDocuments],
    ['Type de document', h.documentType],
    ['Processus', h.process],
    ["Périmètre d'application", h.applicationScope],
    ["Date d'applicabilité", h.applicabilityDate],
  ]

  const bc = { borderColor: U.border }

  return (
    <article
      className="bg-white text-[11pt] shadow-none"
      style={{
        color: U.text,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: U.edfBlue,
      }}
    >
      <header
        className="text-[10pt] leading-snug"
        style={{
          borderBottomWidth: 2,
          borderBottomStyle: 'solid',
          borderBottomColor: U.edfBlue,
        }}
      >
        <div className="bg-white px-3 pt-2 pb-2">
          <div
            className="mb-1 grid w-full text-[10pt] leading-tight text-black"
            style={{
              gridTemplateColumns: '22% 56% 22%',
            }}
          >
            <div className="text-left">Document DIGIT</div>
            <div className="text-center">Accessibilité :</div>
            <div />
          </div>
          <table
            className="w-full border-collapse border border-black bg-white text-black [table-layout:fixed]"
          >
            <colgroup>
              <col style={{ width: '22%' }} />
              <col style={{ width: '56%' }} />
              <col style={{ width: '22%' }} />
            </colgroup>
            <tbody>
              <tr className="align-middle">
                <td
                  rowSpan={2}
                  className="border border-black px-2 py-2 text-center align-middle"
                >
                  <div className="flex justify-center">
                    <EdfHeaderLogoLockup iconSize={40} />
                  </div>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  <p className="m-0 text-[11pt] font-bold leading-snug">
                    {h.title || '—'}
                  </p>
                  {!h.isDigitDocument ? (
                    <p className="m-0 mt-1 text-[9pt] text-neutral-600">
                      Document non marqué DIGIT dans l’en-tête éditable.
                    </p>
                  ) : null}
                </td>
                <td
                  rowSpan={2}
                  className="border border-black px-2 py-2 text-center align-middle"
                >
                  <div className="space-y-0.5 text-[9.5pt] leading-snug">
                    <div>
                      Indice : <span className="font-semibold">{h.indice || '—'}</span>
                    </div>
                    <div>Nb Pages : {h.pageCount || '—'}</div>
                    <div>Nb Annexe(s) : {h.annexCount || '—'}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  <p className="m-0 text-[8.5pt] leading-snug">
                    Référence : {h.reference || '—'}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="m-0 mt-2 text-[9.5pt] font-semibold">{UNITEP_DTEO_ADDRESS}</p>
          <p className="m-0 mt-1 text-[9.5pt] text-neutral-800">
            Page 1 / {h.pageCount?.trim() ? h.pageCount : '?'}
          </p>
        </div>
        <div className="bg-white px-3 pb-2 pt-2">
          <p className="m-0 text-[8.5pt] leading-snug text-neutral-900">
            {UNITEP_COPYRIGHT}
          </p>
          <p className="m-0 mt-1 text-[8.5pt] leading-snug text-neutral-900">
            {UNITEP_EDF_SA_LEGAL}
          </p>
          <p className="m-0 mt-2 text-[8.5pt] font-bold uppercase leading-tight tracking-wide">
            {UNITEP_DIRECTION_LINE}
          </p>
          <p className="m-0 mt-1 text-[11pt] font-bold tracking-wide">{UNITEP_METIERS}</p>
        </div>
      </header>

      <table
        className="w-full border-collapse text-[10pt] [table-layout:fixed]"
        style={{ ...bc, borderWidth: 1, borderStyle: 'solid' }}
      >
        <colgroup>
          <col style={{ width: '35%' }} />
          <col style={{ width: '65%' }} />
        </colgroup>
        <tbody>
          {secondaryRows.map(([k, v]) => (
            <tr key={k}>
              <th
                className="border px-2 py-1.5 text-left align-top font-semibold"
                style={{ ...bc, backgroundColor: U.headerGray, color: U.text }}
              >
                {k}
              </th>
              <td
                className="border px-2 py-1.5 align-top whitespace-pre-wrap"
                style={{ ...bc, backgroundColor: '#ffffff' }}
              >
                {v || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="border-b border-solid px-3 py-3" style={{ borderColor: U.border }}>
        <h2
          className="m-0 border-b-2 border-solid pb-1 text-[11px] font-bold uppercase"
          style={{ color: U.sectionTitleOrange, borderBottomColor: U.accentOrange }}
        >
          Historique des indices
        </h2>
        <p className="m-0 mt-2 text-[9pt] italic text-neutral-700">
          {UNITEP_REVISION_NOTE}
        </p>
        <div className="mt-2 overflow-x-auto">
          <table
            className="w-full min-w-[720px] border-collapse text-[10pt] [table-layout:fixed]"
            style={{ ...bc, borderWidth: 1, borderStyle: 'solid' }}
          >
            <colgroup>
              <col style={{ width: '7%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '38%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr
                style={{ backgroundColor: U.sectionTitleOrange, color: U.onNavy }}
              >
                <th
                  className="border px-1 py-1.5 text-center text-[9.5pt] font-semibold"
                  style={{ ...bc }}
                >
                  Ind.
                </th>
                <th
                  className="border px-1 py-1.5 text-center text-[9.5pt] font-semibold"
                  style={{ ...bc }}
                >
                  Date
                </th>
                <th
                  className="border px-1 py-1.5 text-left text-[9.5pt] font-semibold"
                  style={{ ...bc }}
                >
                  Nature des dernières évolutions
                </th>
                <th
                  className="border px-1 py-1.5 text-left text-[9.5pt] font-semibold"
                  style={{ ...bc }}
                >
                  Rédacteur(s)
                </th>
                <th
                  className="border px-1 py-1.5 text-left text-[9.5pt] font-semibold"
                  style={{ ...bc }}
                >
                  Vérificateur(s)
                </th>
                <th
                  className="border px-1 py-1.5 text-left text-[9.5pt] font-semibold"
                  style={{ ...bc }}
                >
                  Approbateur
                </th>
              </tr>
            </thead>
            <tbody>
              {doc.revisionHistory.map((r) => (
                <tr key={r.id}>
                  <td
                    className="border px-1 py-1.5 align-top text-center"
                    style={{ ...bc, backgroundColor: '#fff' }}
                  >
                    {r.indice}
                  </td>
                  <td
                    className="border px-1 py-1.5 align-top text-center"
                    style={{ ...bc, backgroundColor: '#fff' }}
                  >
                    {r.date}
                  </td>
                  <td
                    className="border px-1 py-1.5 align-top whitespace-pre-wrap"
                    style={{ ...bc, backgroundColor: '#fff' }}
                  >
                    {r.natureEvolution}
                  </td>
                  <td
                    className="border px-1 py-1.5 align-top"
                    style={{ ...bc, backgroundColor: '#fff' }}
                  >
                    {r.redacteur}
                  </td>
                  <td
                    className="border px-1 py-1.5 align-top"
                    style={{ ...bc, backgroundColor: '#fff' }}
                  >
                    {r.verificateur}
                  </td>
                  <td
                    className="border px-1 py-1.5 align-top"
                    style={{ ...bc, backgroundColor: '#fff' }}
                  >
                    {r.approbateur}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-b border-solid px-3 py-3" style={{ borderColor: U.border }}>
        <h2
          className="m-0 border-b-2 border-solid pb-1 text-[11px] font-bold uppercase"
          style={{ color: U.sectionTitleOrange, borderBottomColor: U.accentOrange }}
        >
          Accessibilité du document
        </h2>
        <p className="m-0 mt-2 text-[10pt] leading-snug">
          <span className="font-semibold">
            {ACCESSIBILITY_LEVEL_LABEL[doc.diffusion.accessibilityLevel]}
          </span>{' '}
          — niveau retenu pour la diffusion (saisie onglet « Diffusion »).
        </p>
        <div
          className="mt-3 space-y-2 p-2 text-[9.5pt] leading-snug"
          style={{
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: U.border,
            backgroundColor: U.headerGray,
          }}
        >
          {ALL_ACCESS_LEVELS.map((lvl) => {
            const current = doc.diffusion.accessibilityLevel === lvl
            return (
              <p
                key={lvl}
                className={`m-0 ${current ? 'rounded-sm px-1 py-0.5 font-medium' : ''}`}
                style={
                  current
                    ? { backgroundColor: '#FFF4CC', outline: `1px solid ${U.edfBlue}` }
                    : undefined
                }
              >
                <span className="font-semibold" style={{ color: U.sectionTitleOrange }}>
                  {ACCESSIBILITY_LEVEL_LABEL[lvl]}
                </span>{' '}
                {ACCESSIBILITY_DESCRIPTIONS[lvl]}
              </p>
            )
          })}
        </div>
        <h3
          className="m-0 mt-4 text-[10pt] font-bold uppercase"
          style={{ color: U.sectionTitleOrange }}
        >
          Liste de diffusion (à remplir en cas de diffusion restreinte)
        </h3>
        <table
          className="mt-2 w-full border-collapse text-[10pt] [table-layout:fixed]"
          style={{ ...bc, borderWidth: 1, borderStyle: 'solid' }}
        >
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '50%' }} />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: U.headerGray, color: U.text }}>
              <th
                className="border px-2 py-1.5 text-left align-top text-[9.5pt] font-semibold"
                style={{ ...bc }}
              >
                Destinataire(s) EDF (Nom/Prénom/Entité)
              </th>
              <th
                className="border px-2 py-1.5 text-left align-top text-[9.5pt] font-semibold"
                style={{ ...bc }}
              >
                Destinataire(s) externes EDF (Nom/Prénom/Société)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="border px-2 py-2 align-top whitespace-pre-wrap"
                style={{ ...bc, backgroundColor: '#fff', verticalAlign: 'top' }}
              >
                {doc.diffusion.edfDistributionList || '—'}
              </td>
              <td
                className="border px-2 py-2 align-top whitespace-pre-wrap"
                style={{ ...bc, backgroundColor: '#fff', verticalAlign: 'top' }}
              >
                {doc.diffusion.externalDistributionList || '—'}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          className="mt-3 px-2 py-2 text-[9pt] leading-snug text-neutral-900"
          style={{
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: U.edfBlue,
            backgroundColor: '#F7FAFC',
          }}
        >
          <p className="m-0 font-semibold" style={{ color: U.sectionTitleOrange }}>
            Rappel FID / DOCTEAM (modèle UNITEP)
          </p>
          <ul className="mb-0 mt-1 list-disc pl-4">
            {UNITEP_FID_INSTRUCTIONS.map((t, idx) => (
              <li key={idx} className="mt-0.5">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <nav
        className="unitop-toc border-b border-solid px-3 py-3"
        style={{
          borderColor: U.border,
          backgroundColor: U.headerGray,
        }}
      >
        <h2
          className="m-0 text-[11px] font-bold uppercase"
          style={{ color: U.sectionTitleOrange }}
        >
          Table des matières
        </h2>
        <ul className="m-0 mt-2 list-none p-0 text-[10pt]">
          {doc.sections.map((s, i) => (
            <li
              key={s.id}
              className={
                s.level === 1
                  ? 'toc-row mt-1 font-semibold'
                  : s.level === 2
                    ? 'toc-row mt-1 pl-4'
                    : 'toc-row mt-0.5 pl-8 text-[10pt]'
              }
            >
              <span className="toc-title">
                {formatSectionHeading(nums[i], s.title)}
              </span>
              <span className="toc-leader" aria-hidden />
              <span className="toc-page" />
            </li>
          ))}
          {doc.annexes.map((a, i) => (
            <li key={a.id} className="toc-row mt-1 font-medium">
              <span className="toc-title">
                ANNEXE {i + 1} : {a.title.toUpperCase()}
              </span>
              <span className="toc-leader" aria-hidden />
              <span className="toc-page" />
            </li>
          ))}
        </ul>
        <style>{`
          .unitop-toc .toc-row { display: flex; align-items: baseline; gap: 6px; width: 100%; }
          .unitop-toc .toc-title { flex: 0 1 auto; max-width: 85%; color: ${U.sectionTitleOrange}; }
          .unitop-toc .toc-leader {
            flex: 1 1 auto;
            border-bottom: 1px dotted #b0b0b0;
            min-width: 12px;
            height: 0.72em;
            align-self: center;
          }
          .unitop-toc .toc-page { flex: 0 0 1.5rem; text-align: right; color: #555; font-size: 9.5pt; }
        `}</style>
      </nav>

      <main className="px-3 py-3">
        {doc.sections.map((s, i) => (
          <section key={s.id} className="mb-4">
            {s.level === 1 ? (
              <h2
                className="m-0 border-b border-solid pb-0.5 text-[13pt] font-bold"
                style={{
                  color: U.sectionTitleOrange,
                  borderBottomColor: U.accentOrange,
                }}
              >
                {formatSectionHeading(nums[i], s.title)}
              </h2>
            ) : s.level === 2 ? (
              <h3
                className="m-0 mt-3 border-b border-solid border-transparent pb-0.5 text-[12pt] font-bold"
                style={{ color: U.sectionTitleOrange }}
              >
                {formatSectionHeading(nums[i], s.title)}
              </h3>
            ) : (
              <h4
                className="m-0 mt-2 text-[11pt] font-bold"
                style={{ color: U.sectionTitleOrange }}
              >
                {formatSectionHeading(nums[i], s.title)}
              </h4>
            )}
            <div className="mt-2 space-y-2">
              {s.blocks.map((b) => (
                <BlockView key={b.id} block={b} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {doc.annexes.length > 0 ? (
        <div
          className="border-t-2 border-solid px-3 py-3"
          style={{ borderTopColor: U.edfBlue }}
        >
          {doc.annexes.map((a, i) => (
            <section key={a.id} className="mb-6">
              <h2
                className="m-0 text-[12pt] font-bold"
                style={{ color: U.sectionTitleOrange }}
              >
                Annexe {i + 1} : {a.title}
              </h2>
              <div className="mt-2 space-y-2">
                {a.blocks.map((b) => (
                  <BlockView key={b.id} block={b} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      <footer
        className="mt-2 border-t-2 border-solid px-3 py-2 text-[8.5pt] leading-snug"
        style={{
          borderColor: U.edfBlue,
          backgroundColor: U.headerBandBg,
        }}
      >
        <p
          className="m-0 text-[10px] font-bold leading-tight"
          style={{ color: U.edfBlue }}
        >
          Document DIGIT Accessibilité :
        </p>
        <p
          className="m-0 mt-0.5 text-[10pt] font-semibold"
          style={{ color: U.sectionTitleOrange }}
        >
          {h.title || '—'}
        </p>
        <p className="m-0 mt-1 text-neutral-800">
          Page 1 / {h.pageCount?.trim() ? h.pageCount : '?'}
          <span className="mx-1 text-neutral-500">·</span>
          <span className="text-neutral-700">Référence :</span>{' '}
          {h.reference || '—'}
        </p>
        <p className="m-0 mt-1 text-neutral-900">{UNITEP_COPYRIGHT}</p>
      </footer>
    </article>
  )
}

function BlockView({ block }: { block: SectionBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="whitespace-pre-wrap text-[10.5pt] leading-snug">
          {block.content || '—'}
        </div>
      )
    case 'list':
      return block.ordered ? (
        <ol className="my-1 list-decimal pl-6 text-[10.5pt]">
          {block.items.map((x, j) => (
            <li key={j}>{x}</li>
          ))}
        </ol>
      ) : (
        <ul className="my-1 list-disc pl-6 text-[10.5pt]">
          {block.items.map((x, j) => (
            <li key={j}>{x}</li>
          ))}
        </ul>
      )
    case 'table':
      return <TableView t={block} />
    case 'action_illustration':
      return <AiTable rows={block.rows} caption={block.caption} />
    case 'image':
      return block.imageDataUrl ? (
        <figure>
          <img
            src={block.imageDataUrl}
            alt={block.caption}
            className="max-h-80 max-w-full border border-neutral-300"
          />
          <figcaption className="text-[9pt] text-neutral-600">
            {block.caption}
          </figcaption>
        </figure>
      ) : (
        <p className="text-[10pt] italic text-neutral-500">Image manquante</p>
      )
    case 'remark':
      return (
        <aside
          className={`border-l-4 px-3 py-2 text-[10pt] ${
            block.variant === 'vigilance'
              ? 'border-orange-600 bg-orange-50'
              : 'border-neutral-600 bg-neutral-50'
          }`}
        >
          <strong>
            {block.variant === 'vigilance' ? 'Vigilance' : 'Remarque'}
          </strong>
          <p className="m-0 mt-1 whitespace-pre-wrap">{block.content}</p>
        </aside>
      )
    default:
      return null
  }
}

function TableView({ t }: { t: BlockTable }) {
  const bc = { borderColor: U.border }
  return (
    <table
      className="w-full border-collapse text-[10pt] [table-layout:fixed]"
      style={{ ...bc, borderWidth: 1, borderStyle: 'solid' }}
    >
      <thead>
        <tr style={{ backgroundColor: U.headerGray }}>
          {t.headers.map((h, j) => (
            <th
              key={j}
              className="border px-1 py-1 text-left font-semibold"
              style={{ ...bc, color: U.text }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {t.rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td
                key={j}
                className="border px-1 py-1 align-top"
                style={{ ...bc, backgroundColor: '#fff' }}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AiTable({
  rows,
  caption,
}: {
  rows: ActionIllustrationRow[]
  caption?: string
}) {
  const bc = { borderColor: U.border }
  return (
    <div>
      {caption ? (
        <p
          className="m-0 mb-1 text-[10pt] font-semibold"
          style={{ color: U.sectionTitleOrange }}
        >
          {caption}
        </p>
      ) : null}
      <table
        className="w-full border-collapse text-[10pt] [table-layout:fixed]"
        style={{ ...bc, borderWidth: 1, borderStyle: 'solid' }}
      >
        <colgroup>
          <col style={{ width: '8%' }} />
          <col style={{ width: '47%' }} />
          <col style={{ width: '45%' }} />
        </colgroup>
        <thead>
          <tr
            style={{ backgroundColor: U.sectionTitleOrange, color: U.onNavy }}
          >
            <th className="border px-1 py-1 text-center font-semibold" style={bc}>
              N°
            </th>
            <th
              className="border px-1 py-1 text-left font-semibold"
              style={bc}
            >
              ACTION A RÉALISER
            </th>
            <th className="border px-1 py-1 text-left font-semibold" style={bc}>
              ILLUSTRATION
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              <td
                className="border px-1 py-1 text-center align-top font-mono"
                style={{ ...bc, backgroundColor: '#fff' }}
              >
                {i + 1}
              </td>
              <td
                className="border px-1 py-1 align-top whitespace-pre-wrap"
                style={{ ...bc, backgroundColor: '#fff' }}
              >
                {r.actionText}
                {r.remark ? (
                  <div className="mt-1 border-t border-dotted border-neutral-400 pt-1 text-[9pt] text-neutral-700">
                    {r.remark}
                  </div>
                ) : null}
              </td>
              <td className="border p-1 align-top" style={{ ...bc, backgroundColor: '#fff' }}>
                {r.imageDataUrl ? (
                  <img
                    src={r.imageDataUrl}
                    alt=""
                    className="max-h-48 max-w-full border border-solid"
                    style={{ borderColor: U.border }}
                  />
                ) : (
                  <span className="text-neutral-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
