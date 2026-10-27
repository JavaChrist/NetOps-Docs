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
import { UNITEP_THEME as U } from './unitEepTheme'
import { EDF_LOGO_PNG_DATA_URL } from './edfLogoAsset'

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
  return `<table class="action-ill"><colgroup><col style="width:8%"/><col style="width:47%"/><col style="width:45%"/></colgroup><thead><tr><th class="c-num">N°</th><th>ACTION A RÉALISER</th><th>ILLUSTRATION</th></tr></thead><tbody>${body}</tbody></table>`
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
  const nonDigit = h.isDigitDocument
    ? ''
    : '<p class="cover-note">Document non marqué DIGIT dans l’en-tête éditable.</p>'
  return `<header class="unitop-cover">
<div class="cover-wrap">
<div class="cover-top-line">
<span class="cover-doc-digit">Document DIGIT</span>
<span class="cover-acc-label">Accessibilité :</span>
<span aria-hidden="true"></span>
</div>
<table class="cover-grid">
<colgroup><col style="width:22%"/><col style="width:56%"/><col style="width:22%"/></colgroup>
<tbody>
<tr>
<td class="cover-logo-cell" rowspan="2"><img src="${EDF_LOGO_PNG_DATA_URL}" alt="EDF" class="cover-logo-img"/></td>
<td class="cover-title-cell"><p class="cover-title">${esc(h.title || '—')}</p>${nonDigit}</td>
<td class="cover-meta-cell" rowspan="2"><div class="cover-meta-stack"><div>Indice : <strong>${esc(h.indice || '—')}</strong></div><div>Nb Pages : ${esc(h.pageCount || '—')}</div><div>Nb Annexe(s) : ${esc(h.annexCount || '—')}</div></div></td>
</tr>
<tr>
<td class="cover-ref-cell"><p class="cover-ref">Référence : ${esc(h.reference || '—')}</p></td>
</tr>
</tbody>
</table>
<p class="cover-direction"><strong>${esc(UNITEP_DIRECTION_LINE)}</strong> <strong>${esc(UNITEP_METIERS)}</strong> <span class="cover-entity">Entité émettrice : ${esc(h.issuingEntity || '—')}</span></p>
</div>
</header>`
}

function coverFooterHtml(h: DocumentHeaderBlock): string {
  const pg = h.pageCount?.trim() ? esc(h.pageCount) : '?'
  return `<section class="cover-footer">
<div class="cover-footer-row"><img src="${EDF_LOGO_PNG_DATA_URL}" alt="EDF" class="cover-footer-logo"/><p class="cover-footer-addr">${esc(UNITEP_DTEO_ADDRESS)}</p></div>
<p class="cover-footer-page">Page 1 / ${pg}</p>
<p class="cover-footer-small">${esc(UNITEP_COPYRIGHT)}</p>
<p class="cover-footer-small">${esc(UNITEP_EDF_SA_LEGAL)}</p>
</section>`
}

function secondaryMetaTable(h: DocumentHeaderBlock): string {
  const rows: [string, string][] = [
    ['Résumé', h.summary],
    ['Documents associés', h.relatedDocuments],
  ]
  const inline: [string, string][] = [
    ['Type', h.documentType],
    ['Processus', h.process],
    ["Périmètre d'application", h.applicationScope],
    ["Date d'applicabilité", h.applicabilityDate],
  ]
  const inlineHtml = inline
    .map(([k, v]) => `<p class="cover-inline-field">${esc(k)} : ${esc(v || '—')}</p>`)
    .join('')
  return `<table class="doc-header"><colgroup><col style="width:22%"/><col style="width:78%"/></colgroup><tbody>${rows.map(([k, v]) => headerField(k, v)).join('')}</tbody></table><div class="doc-header-inline">${inlineHtml}</div>`
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
<colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
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
<table class="rev">
<colgroup>
<col style="width:7%"/><col style="width:11%"/><col style="width:38%"/>
<col style="width:14%"/><col style="width:15%"/><col style="width:15%"/>
</colgroup>
<thead><tr>
<th class="rev-center">Ind.</th><th class="rev-center">Date</th>
<th class="rev-left">Nature des dernières évolutions</th>
<th class="rev-left">Rédacteur(s)</th><th class="rev-left">Vérificateur(s)</th><th class="rev-left">Approbateur</th>
</tr></thead><tbody>${revRows}</tbody></table></section>`

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

  const coverFooter = coverFooterHtml(h)

  const styles = `
:root{--u-edf:${U.edfBlue};--u-title:${U.sectionTitleOrange};--u-accent:${U.accentOrange};--u-band:${U.headerBandBg};--u-head:${U.headerGray};--u-bdr:${U.border};--u-txt:${U.text};}
body{font-family:'Segoe UI',Calibri,Arial,sans-serif;font-size:11pt;color:var(--u-txt);max-width:210mm;margin:0 auto;padding:12mm;line-height:1.35;}
.unitop-cover{border-bottom:2px solid var(--u-edf);margin-bottom:10px;font-size:10pt;}
.cover-wrap{background:#fff;padding:10px 12px 12px;}
.cover-top-line{display:grid;grid-template-columns:22% 56% 22%;width:100%;font-size:10pt;line-height:1.25;color:#000;margin-bottom:4px;}
.cover-doc-digit{text-align:left;}
.cover-acc-label{text-align:center;}
table.cover-grid{width:100%;border-collapse:collapse;table-layout:fixed;border:1px solid #000;background:#fff;}
.cover-logo-cell,.cover-title-cell,.cover-meta-cell,.cover-ref-cell{border:1px solid #000;padding:8px;vertical-align:middle;background:#fff;}
.cover-logo-cell{text-align:center;}
.cover-logo-img{display:block;margin:0 auto;width:96px;height:auto;}
.cover-title-cell{text-align:center;}
.cover-title{margin:0;font-size:11pt;font-weight:700;color:#000;}
.cover-note{margin:4px 0 0;font-size:9pt;color:#555;}
.cover-meta-cell{text-align:center;}
.cover-meta-stack{font-size:9.5pt;line-height:1.4;}
.cover-meta-stack div{margin:0 0 2px;}
.cover-ref-cell{text-align:center;}
.cover-ref{margin:0;font-size:8.5pt;line-height:1.35;color:#000;}
.cover-direction{margin:10px 0 0;font-size:9.5pt;line-height:1.35;color:#000;text-transform:uppercase;font-weight:600;}
.cover-direction .cover-entity{font-weight:400;text-transform:none;margin-left:4px;}
.cover-footer{border-top:1px solid var(--u-bdr);margin-top:12px;padding:10px 12px;font-size:8.5pt;line-height:1.35;background:#fff;}
.cover-footer-row{display:flex;align-items:center;gap:10px;}
.cover-footer-logo{width:64px;height:auto;display:block;}
.cover-footer-addr{margin:0;font-weight:600;font-size:10pt;}
.cover-footer-page{margin:6px 0 0;color:#333;font-size:9.5pt;}
.cover-footer-small{margin:6px 0 0;font-size:8.5pt;color:#222;}
table.doc-header{width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:6px;font-size:10pt;}
table.doc-header th,table.doc-header td{border:1px solid #000;padding:6px 8px;vertical-align:top;}
table.doc-header th{background:#fff;text-align:left;font-weight:400;color:#000;}
table.doc-header td{background:#fff;}
.doc-header-inline{padding:4px 0 16px;font-size:10pt;line-height:1.35;color:#000;}
.doc-header-inline .cover-inline-field{margin:0 0 2px;}
.hist h2{font-size:11px;text-transform:uppercase;color:var(--u-title);border-bottom:2px solid var(--u-accent);padding-bottom:4px;}
.hist-note{font-size:9pt;font-style:italic;color:#444;margin:8px 0;}
table.rev,table.norm,table.action-ill,table.diffusion-2col{width:100%;border-collapse:collapse;table-layout:fixed;margin:8px 0 16px;font-size:10pt;}
table.rev th,table.rev td,.norm th,.norm td,.action-ill th,.action-ill td,table.diffusion-2col th,table.diffusion-2col td{border:1px solid var(--u-bdr);padding:6px 8px;vertical-align:top;}
table.rev thead th,table.action-ill thead th{background:var(--u-title);color:#fff;font-weight:600;font-size:9.5pt;}
table.rev thead th.rev-center{text-align:center;}
table.rev thead th.rev-left{text-align:left;}
table.rev tbody td:nth-child(1),table.rev tbody td:nth-child(2){text-align:center;}
table.rev tbody td{background:#fff;}
table.diffusion-2col thead th{background:var(--u-head);font-weight:600;color:var(--u-txt);text-align:left;}
table.diffusion-2col td{background:#fff;}
.diff h2{font-size:11px;text-transform:uppercase;color:var(--u-title);border-bottom:2px solid var(--u-accent);padding-bottom:4px;}
.diff h3.diff-list-title{font-size:10pt;text-transform:uppercase;color:var(--u-title);margin-top:16px;}
.acc-all strong{color:var(--u-title);}
.acc-pick{margin:8px 0 0;}
.acc-all{border:1px solid var(--u-bdr);background:var(--u-head);padding:8px;margin-top:10px;font-size:9.5pt;}
.acc-line{margin:0 0 6px;}
.acc-cur{background:#fff4cc;outline:1px solid var(--u-edf);padding:4px;font-weight:500;}
.fid-box{margin-top:12px;border:1px solid var(--u-edf);background:#f7fafc;padding:8px;font-size:9pt;}
.fid-t{font-weight:bold;color:var(--u-title);margin:0 0 4px;}
.preserv{white-space:pre-wrap;}
.c-num{width:36px;text-align:center;}
.ai-action{width:46%;}
.ai-ill{width:46%;}
.ai-ill img{max-width:100%;height:auto;border:1px solid var(--u-bdr);}
.ai-rem{margin-top:4px;font-size:9pt;color:#555;}
.toc{margin:16px 0;border:1px solid var(--u-bdr);padding:10px;background:var(--u-head);}
.toc h2{font-size:11px;text-transform:uppercase;color:var(--u-title);margin:0;}
.toc a.toc-title{color:var(--u-title);}
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
.sec-l1 .sec-title{color:var(--u-title);border-bottom-color:var(--u-accent);}
.sec-title{color:var(--u-title);margin-bottom:8px;border-bottom:1px solid var(--u-accent);padding-bottom:2px;}
.annex h2{color:var(--u-title);font-size:12pt;margin:12px 0 8px;}
.blk-text p{margin:6px 0;}
.norm thead th{background:var(--u-head);font-weight:600;}
.vig,.rem{border-left:4px solid #e85d04;padding:6px 10px;margin:8px 0;background:#fff8f0;font-size:10pt;}
.rem{border-color:#666;background:#f4f4f4;}
figure.blk-fig{margin:8px 0;} figure.blk-fig img{max-width:100%;border:1px solid var(--u-bdr);}
figcaption{font-size:9pt;color:#555;}
.muted{color:#555;}
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
${coverFooter}
${toc}
<main class="body">${body}</main>
${ann.length ? `<div class="annexes-wrap">${ann}</div>` : ''}
</body></html>`
}
