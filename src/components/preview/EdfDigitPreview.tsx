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

  return (
    <article className="border-2 border-[#00539f] bg-white text-[11pt] text-black shadow-none">
      <header className="border-b-2 border-[#00539f] bg-white px-3 py-2 text-[10pt] leading-snug">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-[65%]">
            <p className="m-0 text-[11px] font-bold leading-tight text-[#00539f]">
              Document DIGIT Accessibilité :
            </p>
            <p className="m-0 mt-1 text-[11pt] font-semibold leading-tight text-black">
              {h.title || '—'}
            </p>
            {!h.isDigitDocument ? (
              <p className="m-0 mt-1 text-[9pt] text-neutral-600">
                Document non marqué DIGIT dans l’en-tête éditable.
              </p>
            ) : null}
          </div>
          <div className="shrink-0 text-[10pt] leading-snug">
            <div>
              <span className="text-neutral-600">Indice :</span>{' '}
              <span className="font-semibold">{h.indice || '—'}</span>
            </div>
            <div>
              <span className="text-neutral-600">Nb Pages :</span>{' '}
              {h.pageCount || '—'}
            </div>
            <div>
              <span className="text-neutral-600">Nb Annexe(s) :</span>{' '}
              {h.annexCount || '—'}
            </div>
            <div className="max-w-[280px]">
              <span className="text-neutral-600">Référence :</span>{' '}
              {h.reference || '—'}
            </div>
          </div>
        </div>
        <p className="m-0 mt-2 text-[9.5pt] font-medium text-black">
          {UNITEP_DTEO_ADDRESS}
        </p>
        <p className="m-0 mt-1 text-[9.5pt] text-neutral-700">
          Page 1 / {h.pageCount?.trim() ? h.pageCount : '?'}
        </p>
        <p className="m-0 mt-2 text-[8.5pt] leading-snug text-neutral-800">
          {UNITEP_COPYRIGHT}
        </p>
        <p className="m-0 mt-1 text-[8.5pt] leading-snug text-neutral-800">
          {UNITEP_EDF_SA_LEGAL}
        </p>
        <p className="m-0 mt-2 text-[8.5pt] font-bold uppercase leading-tight text-black">
          {UNITEP_DIRECTION_LINE}
        </p>
        <p className="m-0 mt-1 text-[11pt] font-bold tracking-wide">
          {UNITEP_METIERS}
        </p>
      </header>

      <table className="w-full border-collapse border border-neutral-500 text-[10pt]">
        <tbody>
          {secondaryRows.map(([k, v]) => (
            <tr key={k}>
              <th className="w-[32%] border border-neutral-400 bg-[#e8e8e8] px-2 py-1 text-left align-top font-semibold">
                {k}
              </th>
              <td className="border border-neutral-400 px-2 py-1 align-top">
                {v || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="border-b border-neutral-300 px-3 py-3">
        <h2 className="m-0 border-b border-neutral-300 pb-1 text-[11px] font-bold uppercase text-[#003d6b]">
          Historique des indices
        </h2>
        <p className="m-0 mt-2 text-[9pt] italic text-neutral-700">
          {UNITEP_REVISION_NOTE}
        </p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-neutral-600 text-[10pt]">
            <thead>
              <tr className="bg-[#003d6b] text-white">
                <th className="border border-neutral-500 px-1 py-1">Ind.</th>
                <th className="border border-neutral-500 px-1 py-1">Date</th>
                <th className="border border-neutral-500 px-1 py-1">
                  Nature des dernières évolutions
                </th>
                <th className="border border-neutral-500 px-1 py-1">
                  Rédacteur(s)
                </th>
                <th className="border border-neutral-500 px-1 py-1">
                  Vérificateur(s)
                </th>
                <th className="border border-neutral-500 px-1 py-1">
                  Approbateur
                </th>
              </tr>
            </thead>
            <tbody>
              {doc.revisionHistory.map((r) => (
                <tr key={r.id}>
                  <td className="border border-neutral-400 px-1 py-1 align-top">
                    {r.indice}
                  </td>
                  <td className="border border-neutral-400 px-1 py-1 align-top">
                    {r.date}
                  </td>
                  <td className="border border-neutral-400 px-1 py-1 align-top whitespace-pre-wrap">
                    {r.natureEvolution}
                  </td>
                  <td className="border border-neutral-400 px-1 py-1 align-top">
                    {r.redacteur}
                  </td>
                  <td className="border border-neutral-400 px-1 py-1 align-top">
                    {r.verificateur}
                  </td>
                  <td className="border border-neutral-400 px-1 py-1 align-top">
                    {r.approbateur}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-b border-neutral-300 px-3 py-3">
        <h2 className="m-0 border-b border-neutral-300 pb-1 text-[11px] font-bold uppercase text-[#003d6b]">
          Accessibilité du document
        </h2>
        <p className="m-0 mt-2 text-[10pt] leading-snug">
          <span className="font-semibold">
            {ACCESSIBILITY_LEVEL_LABEL[doc.diffusion.accessibilityLevel]}
          </span>{' '}
          — niveau retenu pour la diffusion (saisie onglet « Diffusion »).
        </p>
        <div className="mt-3 space-y-2 border border-neutral-400 bg-[#fafafa] p-2 text-[9.5pt] leading-snug">
          {ALL_ACCESS_LEVELS.map((lvl) => {
            const current = doc.diffusion.accessibilityLevel === lvl
            return (
              <p
                key={lvl}
                className={`m-0 ${current ? 'rounded-sm bg-amber-100/90 px-1 py-0.5 font-medium' : ''}`}
              >
                <span className="font-semibold text-[#003d6b]">
                  {ACCESSIBILITY_LEVEL_LABEL[lvl]}
                </span>{' '}
                {ACCESSIBILITY_DESCRIPTIONS[lvl]}
              </p>
            )
          })}
        </div>
        <h3 className="m-0 mt-4 text-[10pt] font-bold uppercase text-[#003d6b]">
          Liste de diffusion (à remplir en cas de diffusion restreinte)
        </h3>
        <table className="mt-2 w-full border-collapse border border-neutral-500 text-[10pt]">
          <thead>
            <tr className="bg-[#e8e8e8]">
              <th className="w-[50%] border border-neutral-400 px-2 py-1 text-left font-semibold">
                Destinataire(s) EDF (Nom/Prénom/Entité)
              </th>
              <th className="border border-neutral-400 px-2 py-1 text-left font-semibold">
                Destinataire(s) externes EDF (Nom/Prénom/Société)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-neutral-400 px-2 py-1 align-top whitespace-pre-wrap">
                {doc.diffusion.edfDistributionList || '—'}
              </td>
              <td className="border border-neutral-400 px-2 py-1 align-top whitespace-pre-wrap">
                {doc.diffusion.externalDistributionList || '—'}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-3 rounded-sm border border-amber-200/80 bg-amber-50/50 px-2 py-2 text-[9pt] leading-snug text-neutral-800">
          <p className="m-0 font-semibold text-[#003d6b]">
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

      <nav className="unitop-toc border-b border-neutral-300 bg-[#fafafa] px-3 py-3">
        <h2 className="m-0 text-[11px] font-bold uppercase text-[#003d6b]">
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
          .unitop-toc .toc-title { flex: 0 1 auto; max-width: 85%; }
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
              <h2 className="m-0 border-b border-neutral-300 pb-0.5 text-[13pt] font-bold text-[#003d6b]">
                {formatSectionHeading(nums[i], s.title)}
              </h2>
            ) : s.level === 2 ? (
              <h3 className="m-0 mt-3 text-[12pt] font-bold text-[#1a1a1a]">
                {formatSectionHeading(nums[i], s.title)}
              </h3>
            ) : (
              <h4 className="m-0 mt-2 text-[11pt] font-bold text-[#333]">
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
        <div className="border-t-2 border-neutral-400 px-3 py-3">
          {doc.annexes.map((a, i) => (
            <section key={a.id} className="mb-6">
              <h2 className="m-0 text-[12pt] font-bold text-[#003d6b]">
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
  return (
    <table className="w-full border-collapse border border-neutral-500 text-[10pt]">
      <thead>
        <tr className="bg-neutral-200">
          {t.headers.map((h, j) => (
            <th key={j} className="border border-neutral-400 px-1 py-0.5 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {t.rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} className="border border-neutral-400 px-1 py-0.5 align-top">
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
  return (
    <div>
      {caption ? (
        <p className="m-0 mb-1 text-[10pt] font-semibold text-[#003d6b]">
          {caption}
        </p>
      ) : null}
      <table className="w-full border-collapse border border-neutral-600 text-[10pt]">
        <thead>
          <tr className="bg-[#003d6b] text-white">
            <th className="w-8 border border-neutral-500 px-1 py-1">N°</th>
            <th className="border border-neutral-500 px-1 py-1 text-left">
              ACTION A RÉALISER
            </th>
            <th className="w-[38%] border border-neutral-500 px-1 py-1">
              ILLUSTRATION
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              <td className="border border-neutral-400 px-1 py-1 text-center align-top font-mono">
                {i + 1}
              </td>
              <td className="border border-neutral-400 px-1 py-1 align-top whitespace-pre-wrap">
                {r.actionText}
                {r.remark ? (
                  <div className="mt-1 border-t border-dotted border-neutral-300 pt-1 text-[9pt] text-neutral-600">
                    {r.remark}
                  </div>
                ) : null}
              </td>
              <td className="border border-neutral-400 p-1 align-top">
                {r.imageDataUrl ? (
                  <img
                    src={r.imageDataUrl}
                    alt=""
                    className="max-h-48 max-w-full border border-neutral-300"
                  />
                ) : (
                  <span className="text-neutral-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
