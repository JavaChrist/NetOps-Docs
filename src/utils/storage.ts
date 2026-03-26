import type { EdfDigitDocument } from '../types/edfDigitDocument'

const STORAGE_KEY = 'edf-digit-documents:v1'

export function loadDocumentsFromStorage(): EdfDigitDocument[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return parsed as EdfDigitDocument[]
  } catch {
    return null
  }
}

export function saveDocumentsToStorage(documents: EdfDigitDocument[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents))
  } catch {
    /* quota */
  }
}

/** @deprecated ancienne clé procédures — migration one-shot si présente. */
const LEGACY_PROC_KEY = 'netops-axis-procedures:v1'

export function tryMigrateLegacyProcedures(): void {
  try {
    const cur = localStorage.getItem(STORAGE_KEY)
    if (cur) return
    const leg = localStorage.getItem(LEGACY_PROC_KEY)
    if (!leg) return
    /* ne pas migrer automatiquement le schéma : ancien format incompatible. */
  } catch {
    /* ignore */
  }
}
