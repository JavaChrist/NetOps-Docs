import type {
  AccessibilityLevel,
  ActionIllustrationRow,
  Annex,
  BlockTable,
  DocumentHeaderBlock,
  DocumentSection,
  EdfDigitDocument,
  SectionBlock,
} from '../types/edfDigitDocument'
import { ACCESSIBILITY_DESCRIPTIONS } from '../types/edfDigitDocument'
import { computeSectionNumbers, formatSectionHeading } from './sectionNumbering'
import {
  ACCESSIBILITY_LEVEL_LABEL,
  UNITEP_COPYRIGHT,
  UNITEP_DIRECTION_LINE,
  UNITEP_DTEO_ADDRESS,
  UNITEP_EDF_SA_LEGAL,
  UNITEP_FID_INSTRUCTIONS,
  UNITEP_METIERS,
  UNITEP_REVISION_NOTE,
} from './unitEepTemplateCopy'

const ALL_ACCESS_LEVELS: AccessibilityLevel[] = [
  'LIBRE',
  'INTERNE',
  'LIMITE',
  'CONFIDENTIEL',
]

export function exportEdfDigitJson(doc: EdfDigitDocument): string {
  return JSON.stringify(doc, null, 2)
}

function esc(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function headerField(label: string, value: string): string {
  return `<tr><th scope="row">${esc(label)}</th><td>${esc(value || '—')}</td></tr>`
}

function buildBlockHtml(block: SectionBlock, rowIndex: number): string {
  switch (block.type) {
    case 'text':
      return `<div class="blk-text"><p>${esc(block.content).replaceAll('\n', '<br/>')}</p></div>`
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul'
      const items = block.items.map((i) => `<li>${esc(i)}</li>`).join('')
      return `<div class="blk-list"><${tag}>${items}</${tag}></div>`
    }
    case 'table':
      return buildNormTable(block)
    case 'action_illustration':
      return buildActionIllustrationTable(block.rows, rowIndex)
    case 'image':
      return block.imageDataUrl
        ? `<figure class="blk-fig"><img src="${block.imageDataUrl}" alt="${esc(block.caption)}" /><figcaption>${esc(block.caption)}</figcaption></figure>`
        : `<p class="muted">(Image non fournie)</p>`
    case 'remark': {
      const cls = block.variant === 'vigilance' ? 'vig' : 'rem'
      return `<aside class="${cls}"><strong>${block.variant === 'vigilance' ? 'Vigilance' : 'Remarque'}</strong><p>${esc(block.content).replaceAll('\n', '<br/>')}</p></aside>`
    }
    default:
      return ''
  }
}

function buildNormTable(t: BlockTable): string {
  const head = `<thead><tr>${t.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>`
  const body = `<tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>`
  return `<table class="norm">${head}${body}</table>`
}

function buildActionIllustrationTable(
  rows: ActionIllustrationRow[],
  baseIdx: number,
): string {
  const body = rows
    .map((r, i) => {
      const n = i + 1
      const img = r.imageDataUrl
        ? `<img src="${r.imageDataUrl}" alt="Illustration ${n}" />`
        : `<span class="muted">—</span>`
      const rem = r.remark ? `<div class="ai-rem">${esc(r.remark)}</div>` : ''
      return `<tr><td class="ai-num">${n}</td><td class="ai-action">${esc(r.actionText).replaceAll('\n', '<br/>')}${rem}</td><td class="ai-ill">${img}</td></tr>`
    })
    .join('')
  void baseIdx
  return `<table class="action-ill"><thead><tr><th class="c-num">N°</th><th>ACTION A RÉALISER</th><th>ILLUSTRATION</th></tr></thead><tbody>${body}</tbody></table>`
}

function annexBlocksHtml(blocks: SectionBlock[]): string {
  return blocks.map((b, i) => buildBlockHtml(b, i)).join('\n')
}

function sectionHtml(sec: DocumentSection, num: string): string {
  const lv = sec.level
  const tag = lv === 1 ? 'h2' : lv === 2 ? 'h3' : 'h4'
  const h = formatSectionHeading(num, sec.title)
  const blocks = sec.blocks.map((b, i) => buildBlockHtml(b, i)).join('\n')
  return `<section class="sec-l${lv}"><${tag} class="sec-title">${esc(h)}</${tag}>${blocks}</section>`
}

function tocHtml(
  sections: DocumentSection[],
  nums: string[],
  annexes: Annex[],
): string {
  const main = sections
    .map((s, i) => {
      const title = formatSectionHeading(nums[i], s.title)
      const anchor = `sec-${i}`
      return `<li class="toc-row toc-l${s.level}"><a class="toc-title" href="#${anchor}">${esc(title)}</a><span class="toc-leader"></span><span class="toc-page"></span></li>`
    })
    .join('')
  const ax = annexes
    .map((a, i) => {
      const anchor = `ann-${i}`
      const t = `ANNEXE ${i + 1} : ${a.title.toUpperCase()}`
      return `<li class="toc-row toc-ann"><a class="toc-title" href="#${anchor}">${esc(t)}</a><span class="toc-leader"></span><span class="toc-page"></span></li>`
    })
    .join('')
  return `<nav class="toc"><h2>Table des matières</h2><ul>${main}${ax}</ul></nav>`
}

function coverBlockHtml(h: DocumentHeaderBlock): string {
  const pg = h.pageCount?.trim() ? esc(h.pageCount) : '?'
  const nonDigit = h.isDigitDocument
    ? ''
    : '<p class="cover-note">Document non marqué DIGIT dans l’en-tête éditable.</p>'
  return `<header class="unitop-cover">
<div class="cover-top">
<div class="cover-left">
<p class="cover-label">Document DIGIT Accessibilité :</p>
<p class="cover-title">${esc(h.title || '—')}</p>
${nonDigit}
</div>
<div class="cover-meta">
<div><span class="muted">Indice :</span> <strong>${esc(h.indice || '—')}</strong></div>
<div><span class="muted">Nb Pages :</span> ${esc(h.pageCount || '—')}</div>
<div><span class="muted">Nb Annexe(s) :</span> ${esc(h.annexCount || '—')}</div>
<div><span class="muted">Référence :</span> ${esc(h.reference || '—')}</div>
</div>
</div>
<p class="cover-addr">${esc(UNITEP_DTEO_ADDRESS)}</p>
<p class="cover-page">Page 1 / ${pg}</p>
<p class="cover-small">${esc(UNITEP_COPYRIGHT)}</p>
<p class="cover-small">${esc(UNITEP_EDF_SA_LEGAL)}</p>
<p class="cover-dir">${esc(UNITEP_DIRECTION_LINE)}</p>
<p class="cover-metiers">${esc(UNITEP_METIERS)}</p>
</header>`
}

function secondaryMetaTable(h: DocumentHeaderBlock): string {
  const rows: [string, string][] = [
    ['Entité émettrice', h.issuingEntity],
    ['Résumé', h.summary],
    ['Documents associés', h.relatedDocuments],
    ['Type de document', h.documentType],
    ['Processus', h.process],
    ["Périmètre d'application", h.applicationScope],
    ["Date d'applicabilité", h.applicabilityDate],
  ]
  return `<table class="doc-header">${rows.map(([k, v]) => headerField(k, v)).join('')}</table>`
}

function accessibilitySectionHtml(doc: EdfDigitDocument): string {
  const lvl = doc.diffusion.accessibilityLevel
  const blocks = ALL_ACCESS_LEVELS.map((l) => {
    const cur = l === lvl ? ' acc-cur' : ''
    return `<p class="acc-line${cur}"><strong>${esc(ACCESSIBILITY_LEVEL_LABEL[l])}</strong> ${esc(ACCESSIBILITY_DESCRIPTIONS[l])}</p>`
  }).join('')
  const fidLi = UNITEP_FID_INSTRUCTIONS.map((t) => `<li>${esc(t)}</li>`).join('')
  return `<section class="diff">
<h2>Accessibilité du document</h2>
<p class="acc-pick"><strong>${esc(ACCESSIBILITY_LEVEL_LABEL[lvl])}</strong> — niveau retenu pour la diffusion.</p>
<div class="acc-all">${blocks}</div>
<h3 class="diff-list-title">Liste de diffusion (à remplir en cas de diffusion restreinte)</h3>
<table class="diffusion-2col">
<thead><tr>
<th>Destinataire(s) EDF (Nom/Prénom/Entité)</th>
<th>Destinataire(s) externes EDF (Nom/Prénom/Société)</th>
</tr></thead>
<tbody><tr>
<td class="preserv">${esc(doc.diffusion.edfDistributionList || '—')}</td>
<td class="preserv">${esc(doc.diffusion.externalDistributionList || '—')}</td>
</tr></tbody>
</table>
<div class="fid-box"><p class="fid-t">Rappel FID / DOCTEAM (modèle UNITEP)</p><ul>${fidLi}</ul></div>
</section>`
}

function addSectionAnchors(html: string): string {
  let i = 0
  return html.replace(
    /<section class="sec-l/g,
    () => `<section id="sec-${i++}" class="sec-l`,
  )
}

export function buildEdfDigitHtmlDocument(doc: EdfDigitDocument): string {
  const nums = computeSectionNumbers(doc.sections)
  const h = doc.header

  const cover = coverBlockHtml(h)
  const headerTable = secondaryMetaTable(h)

  const revRows = doc.revisionHistory
    .map(
      (r) =>
        `<tr><td>${esc(r.indice)}</td><td>${esc(r.date)}</td><td>${esc(r.natureEvolution)}</td><td>${esc(r.redacteur)}</td><td>${esc(r.verificateur)}</td><td>${esc(r.approbateur)}</td></tr>`,
    )
    .join('')

  const rev = `<section class="hist"><h2>Historique des indices</h2>
<p class="hist-note">${esc(UNITEP_REVISION_NOTE)}</p>
<table class="rev"><thead><tr><th>Ind.</th><th>Date</th><th>Nature des dernières évolutions</th><th>Rédacteur(s)</th><th>Vérificateur(s)</th><th>Approbateur</th></tr></thead><tbody>${revRows}</tbody></table></section>`

  const diff = accessibilitySectionHtml(doc)

  const toc = tocHtml(doc.sections, nums, doc.annexes)

  let body = doc.sections
    .map((s, i) => sectionHtml(s, nums[i]))
    .join('\n')
  body = addSectionAnchors(body)

  const ann = doc.annexes
    .map(
      (a, i) =>
        `<section class="annex" id="ann-${i}"><h2>Annexe ${i + 1} : ${esc(a.title)}</h2>${annexBlocksHtml(a.blocks)}</section>`,
    )
    .join('')

  const styles = `
body{font-family:'Segoe UI',Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;max-width:210mm;margin:0 auto;padding:12mm;line-height:1.35;}
.unitop-cover{border-bottom:2px solid #00539f;padding-bottom:10px;margin-bottom:10px;font-size:10pt;}
.cover-top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;}
.cover-label{margin:0;color:#00539f;font-weight:bold;font-size:11px;}
.cover-title{margin:4px 0 0;font-size:11pt;font-weight:600;}
.cover-note{margin:4px 0 0;font-size:9pt;color:#555;}
.cover-meta{flex-shrink:0;font-size:10pt;line-height:1.35;}
.cover-addr{margin:8px 0 0;font-weight:600;}
.cover-page{margin:4px 0 0;color:#444;font-size:9.5pt;}
.cover-small{margin:6px 0 0;font-size:8.5pt;line-height:1.3;color:#222;}
.cover-dir{margin:8px 0 0;font-size:8.5pt;font-weight:bold;text-transform:uppercase;}
.cover-metiers{margin:4px 0 0;font-size:11pt;font-weight:bold;}
table.doc-header{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:10pt;}
table.doc-header th,table.doc-header td{border:1px solid #999;padding:4px 6px;vertical-align:top;}
table.doc-header th{width:32%;background:#e8e8e8;text-align:left;font-weight:600;}
.hist-note{font-size:9pt;font-style:italic;color:#444;margin:8px 0;}
table.rev,table.norm,table.action-ill,table.diffusion-2col{width:100%;border-collapse:collapse;margin:8px 0 16px;font-size:10pt;}
table.rev th,table.rev td,.norm th,.norm td,.action-ill th,.action-ill td,table.diffusion-2col th,table.diffusion-2col td{border:1px solid #666;padding:4px 6px;vertical-align:top;}
table.rev thead th,table.action-ill thead th{background:#003d6b;color:#fff;}
table.diffusion-2col thead th{background:#e8e8e8;font-weight:600;}
.diff h2{font-size:11px;text-transform:uppercase;color:#003d6b;border-bottom:1px solid #ccc;padding-bottom:4px;}
.diff h3.diff-list-title{font-size:10pt;text-transform:uppercase;color:#003d6b;margin-top:16px;}
.acc-pick{margin:8px 0 0;}
.acc-all{border:1px solid #999;background:#fafafa;padding:8px;margin-top:10px;font-size:9.5pt;}
.acc-line{margin:0 0 6px;}
.acc-cur{background:#fff8e6;padding:4px;border-radius:2px;font-weight:500;}
.fid-box{margin-top:12px;border:1px solid #e6c88a;background:#fffbeb;padding:8px;font-size:9pt;}
.fid-t{font-weight:bold;color:#003d6b;margin:0 0 4px;}
.preserv{white-space:pre-wrap;}
.c-num{width:36px;text-align:center;}
.ai-action{width:46%;}
.ai-ill{width:46%;}
.ai-ill img{max-width:100%;height:auto;border:1px solid #ccc;}
.ai-rem{margin-top:4px;font-size:9pt;color:#555;}
.toc{margin:16px 0;border:1px solid #ccc;padding:10px;background:#fafafa;}
.toc h2{font-size:11px;text-transform:uppercase;color:#003d6b;margin:0;}
.toc ul{list-style:none;padding:0;margin:8px 0 0;}
.toc-row{display:flex;align-items:baseline;gap:6px;width:100%;}
.toc-title{flex:0 1 auto;max-width:85%;}
.toc-l2 .toc-title{padding-left:16px;}
.toc-l3 .toc-title{padding-left:32px;font-size:10pt;}
.toc-leader{flex:1 1 auto;border-bottom:1px dotted #b0b0b0;min-width:12px;height:0.72em;align-self:center;}
.toc-page{flex:0 0 1.5rem;text-align:right;color:#555;font-size:9.5pt;}
.toc-ann{font-weight:600;}
.sec-l1{margin-top:20px;}
.sec-l2{margin-top:14px;}
.sec-l3{margin-top:10px;}
.sec-title{color:#003d6b;margin-bottom:8px;border-bottom:1px solid #ccc;padding-bottom:2px;}
.blk-text p{margin:6px 0;}
.vig,.rem{border-left:4px solid #e85d04;padding:6px 10px;margin:8px 0;background:#fff8f0;font-size:10pt;}
.rem{border-color:#666;background:#f4f4f4;}
figure.blk-fig{margin:8px 0;} figure.blk-fig img{max-width:100%;border:1px solid #ccc;}
figcaption{font-size:9pt;color:#555;}
.muted{color:#666;}
@media print{a{color:#000;text-decoration:none;}}
`

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"/><title>${esc(h.title || 'Document DIGIT')}</title>
<style>${styles}</style></head>
<body>
${cover}
${headerTable}
${rev}
${diff}
${toc}
<main class="body">${body}</main>
${ann.length ? `<div class="annexes-wrap">${ann}</div>` : ''}
</body></html>`
}
