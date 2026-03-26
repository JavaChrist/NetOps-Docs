import type { AccessibilityLevel } from '../types/edfDigitDocument'

/** Libellés affichés comme sur le modèle WORD/PDF UNITEP (ind. 7). */
export const ACCESSIBILITY_LEVEL_LABEL: Record<AccessibilityLevel, string> = {
  LIBRE: 'LIBRE (C=0)',
  INTERNE: 'INTERNE (C=1)',
  LIMITE: 'LIMITÉ (C=2)',
  CONFIDENTIEL: 'CONFIDENTIEL (C=3)',
}

export const UNITEP_DTEO_ADDRESS =
  'EDF – DTEO – DIGIT 32 Avenue Pablo Picasso 92000 NANTERRE'

export const UNITEP_COPYRIGHT =
  "Copyright EDF - Ce document est la propriété d'EDF. Toute communication, reproduction, publication, même partielle, est interdite sauf autorisation."

export const UNITEP_EDF_SA_LEGAL =
  'EDF SA - 22-30 avenue de Wagram 75008 Paris — tél. : 33 (0)1 40 42 22 22 — courriel : masteredfcom@edf.fr — capital social : 2 000 466 841 euros — 552 081 317 R.C.S. Paris — Adresse web : www.edf.com'

export const UNITEP_DIRECTION_LINE =
  'DIRECTION DE LA TRANSFORMATION ET EFFICACITE OPERATIONNELLE – DIRECTION OPERATIONS GROUPE INFORMATIQUE ET TELECOMS'

export const UNITEP_METIERS = 'METIERS'

export const UNITEP_REVISION_NOTE =
  "Veillez à conserver les informations liées à l'indice courant (création) + informations des deux derniers indices."

export const UNITEP_FID_INSTRUCTIONS: string[] = [
  "Les informations des champs < Accessibilité >, < Titre >, < Référence >, < Indice >, < Résumé > et < Processus SMI > sont synchronisées avec les valeurs renseignées au niveau de la FID dans DOCTEAM. Veillez à ne pas casser ces champs synchronisés : pour rectifier ou compléter ces informations, la bonne pratique consiste à le faire depuis la FID uniquement (clic droit sur le document pour accéder à ses « Propriétés », puis aux champs concernés ; les informations seront mises à jour dans le document lors de la synchronisation).",
  'Les informations non synchronisées sont à modifier directement dans le corps du document.',
]
