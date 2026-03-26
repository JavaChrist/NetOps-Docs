import { Packer } from 'docx'
import type { EdfDigitDocument } from '../../types/edfDigitDocument'
import { buildEdfDigitDocxDocument } from './buildEdfDigitDocxDocument'

/** Blob OOXML (.docx) — document DIGIT structuré. */
export async function exportEdfDigitDocxBlob(
  doc: EdfDigitDocument,
): Promise<Blob> {
  const file = await buildEdfDigitDocxDocument(doc)
  return Packer.toBlob(file)
}

export { buildEdfDigitDocxDocument } from './buildEdfDigitDocxDocument'

/** Thème DOCX partagé (extension charte EDF). */
export { PROCEDURE_DOCX_THEME as EDF_DOCX_THEME } from './procedureDocxTheme'
