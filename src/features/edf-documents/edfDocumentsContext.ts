import { createContext, useContext } from 'react'
import type { EdfDigitDocument } from '../../types/edfDigitDocument'

export type EdfDocumentsContextValue = {
  documents: EdfDigitDocument[]
  getById: (id: string) => EdfDigitDocument | undefined
  add: (doc: EdfDigitDocument) => void
  addEmpty: () => EdfDigitDocument
  update: (doc: EdfDigitDocument) => void
  remove: (id: string) => void
  duplicate: (id: string) => EdfDigitDocument | null
}

export const EdfDocumentsContext =
  createContext<EdfDocumentsContextValue | null>(null)

export function useEdfDocuments(): EdfDocumentsContextValue {
  const c = useContext(EdfDocumentsContext)
  if (!c) throw new Error('useEdfDocuments dans EdfDocumentsProvider')
  return c
}
