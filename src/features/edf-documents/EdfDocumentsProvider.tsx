import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { EdfDigitDocument } from '../../types/edfDigitDocument'
import {
  createEmptyEdfDigitDocument,
  duplicateEdfDigitDocument,
  nowIso,
} from '../../utils/edfDocumentFactories'
import { loadDocumentsFromStorage, saveDocumentsToStorage } from '../../utils/storage'
import { createId } from '../../utils/id'
import { EdfDocumentsContext } from './edfDocumentsContext'

export function EdfDocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<EdfDigitDocument[]>(() => {
    const s = loadDocumentsFromStorage()
    if (s && s.length > 0) return s
    return [createEmptyEdfDigitDocument()]
  })

  useEffect(() => {
    saveDocumentsToStorage(documents)
  }, [documents])

  const getById = useCallback(
    (id: string) => documents.find((d) => d.id === id),
    [documents],
  )

  const add = useCallback((doc: EdfDigitDocument) => {
    setDocuments((prev) => [doc, ...prev])
  }, [])

  const addEmpty = useCallback(() => {
    const d = createEmptyEdfDigitDocument()
    setDocuments((prev) => [d, ...prev])
    return d
  }, [])

  const update = useCallback((doc: EdfDigitDocument) => {
    setDocuments((prev) =>
      prev.map((x) =>
        x.id === doc.id ? { ...doc, updatedAt: nowIso() } : x,
      ),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setDocuments((prev) => {
      const next = prev.filter((d) => d.id !== id)
      return next.length > 0 ? next : [createEmptyEdfDigitDocument()]
    })
  }, [])

  const duplicate = useCallback((id: string) => {
    const src = documents.find((d) => d.id === id)
    if (!src) return null
    const copy = duplicateEdfDigitDocument(src)
    copy.header.title = copy.header.title
      ? `${copy.header.title} (copie)`
      : 'Copie sans titre'
    copy.header.reference = copy.header.reference
      ? `${copy.header.reference}-COPY`
      : `COPY-${createId().slice(0, 8)}`
    setDocuments((prev) => [copy, ...prev])
    return copy
  }, [documents])

  const value = useMemo(
    () => ({
      documents,
      getById,
      add,
      addEmpty,
      update,
      remove,
      duplicate,
    }),
    [documents, getById, add, addEmpty, update, remove, duplicate],
  )

  return (
    <EdfDocumentsContext.Provider value={value}>
      {children}
    </EdfDocumentsContext.Provider>
  )
}
