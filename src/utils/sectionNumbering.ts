import type { DocumentSection } from '../types/edfDigitDocument'

/**
 * Numérotation hiérarchique 1. / 1.1 / 1.1.1 alignée sur les niveaux successifs.
 */
export function computeSectionNumbers(sections: Pick<DocumentSection, 'level'>[]): string[] {
  let n1 = 0
  let n2 = 0
  let n3 = 0
  const nums: string[] = []

  for (const s of sections) {
    if (s.level === 1) {
      n1++
      n2 = 0
      n3 = 0
      nums.push(String(n1))
    } else if (s.level === 2) {
      if (n1 === 0) n1 = 1
      n2++
      n3 = 0
      nums.push(`${n1}.${n2}`)
    } else {
      if (n1 === 0) n1 = 1
      if (n2 === 0) n2 = 1
      n3++
      nums.push(`${n1}.${n2}.${n3}`)
    }
  }

  return nums
}

export function formatSectionHeading(num: string, title: string): string {
  return `${num}. ${title}`.trim()
}
