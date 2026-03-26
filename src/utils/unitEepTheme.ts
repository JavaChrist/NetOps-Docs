/**
 * Charte visuelle alignée sur le modèle UNITEP / document DIGIT (Word officiel).
 * Une seule source pour preview React, export HTML et styles imprimables.
 */
export const UNITEP_THEME = {
  /** Bleu EDF barres et filets principaux */
  edfBlue: '#00539F',
  /** Rouge signature (logo, accents) */
  edfRed: '#E3000F',
  /**
   * Titres de sections, sommaire, annexes — orange type modèle Word UNITEP ind.7
   * (styles « Titre 1 / chapo » du gabarit).
   */
  sectionTitleOrange: '#C65911',
  /** Variante plus vive pour bandeaux d’accent */
  accentOrange: '#E85D04',
  /** Bleu marine : en-têtes de tableau, texte sur fond foncé si besoin */
  navy: '#003D6B',
  /** Fond bandeau d’en-tête (proche Word) */
  headerBandBg: '#F2F2F2',
  /** Fond cellules « libellé » des tableaux de métadonnées */
  headerGray: '#E8E8E8',
  /** Filets de tableau : noir unitaire comme dans Word */
  border: '#000000',
  /** Texte courant */
  text: '#000000',
  /** Texte sur fond marine / orange foncé */
  onNavy: '#FFFFFF',
} as const
