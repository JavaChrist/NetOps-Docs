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

/** Logo EDF simplifié (SVG) pour export HTML — aligné charte bleu / rouge. */
export const UNITEP_EDF_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="52" viewBox="0 0 40 46" aria-hidden="true"><path fill="#00539F" d="M20 2c8.5 0 15.5 6 17.5 14l-6.8 2.5C28.8 12 25.2 9 20 9c-5.5 0-10.2 3.5-11.8 8.5L2 14.5C4.8 6 11.8 2 20 2z"/><path fill="#E3000F" d="M20 44c-8.5 0-15.5-6-17.5-14l6.8-2.5c2.9 6.5 6.5 9.5 11.7 9.5 5.5 0 10.2-3.5 11.8-8.5l6.2 3C35.2 40 28.2 44 20 44z"/></svg>`

/** Entête modèle UNITEP : pictogramme orange + « eDF » bleu (export HTML couverture). */
export const UNITEP_EDF_HEADER_LOCKUP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="44" viewBox="0 0 128 44" aria-hidden="true"><g transform="translate(2,4)"><circle cx="22" cy="18" r="7" fill="#F39200"/><g fill="#F39200"><ellipse cx="22" cy="4" rx="5" ry="8"/><ellipse cx="22" cy="32" rx="5" ry="8"/><ellipse cx="8" cy="18" rx="8" ry="5"/><ellipse cx="36" cy="18" rx="8" ry="5"/><ellipse cx="12" cy="8" rx="5" ry="7" transform="rotate(-45 12 8)"/><ellipse cx="32" cy="8" rx="5" ry="7" transform="rotate(45 32 8)"/><ellipse cx="12" cy="28" rx="5" ry="7" transform="rotate(45 12 28)"/><ellipse cx="32" cy="28" rx="5" ry="7" transform="rotate(-45 32 28)"/></g><circle cx="22" cy="18" r="5.5" fill="#fff" opacity="0.35"/></g><text font-family="Segoe UI,Calibri,Arial,sans-serif" font-weight="700" fill="#003978" x="56" y="29"><tspan font-size="20.5">e</tspan><tspan font-size="22">DF</tspan></text></svg>`
