/**
 * Paramètres visuels centraux du DOCX.
 * Toute évolution de charte (polices, couleurs, tailles) se fait ici.
 */
export const PROCEDURE_DOCX_THEME = {
  fontBody: 'Calibri',
  fontMono: 'Consolas',
  /** Tailles en demi-points Word (ex. 22 → 11 pt). */
  halfPt: {
    docTitle: 32,
    sectionTitle: 22,
    stepTitle: 24,
    body: 22,
    small: 20,
    caption: 18,
  },
  color: {
    navy: '003D6B',
    heading: '1C1B19',
    muted: '5C5854',
    accent: 'C4540A',
  },
  /** Largeur max des captures (px), avant insertion dans le flux. */
  imageMaxWidthPx: 520,
} as const
