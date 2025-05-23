import * as XLSX from 'xlsx'

export { chLabel } from './table-label-ch'
export * from './base-import-header'
export * from './employ-import-header'
export * from './poverty-import-header'
export * from './competition-import-header'
export * from './cadre-import-headers'
export * from './foreign-import.header'
export * from "./status-import-header"
export * from "./scholarship-import-header"
export * from "./punishment-import-headers"
export * from "./academicWork-import-header"
export * from "./leave-import-header"
export * from "./precaution-import-header"

export interface TableHeader {
  type: string
  field: string
  label: string
  require: boolean
  options?: any[] | null
  validate?: (content: any, oldContent: any, record: any, field: any) => string
  toText?: (content: any) => string
  toValue?: (content: any) => any
}

export function HeaderValidChecker<T extends { [key: string]: any }>(instance: T, headers: TableHeader[]): boolean {
  for (const check of headers) {
    const result = check.validate?.(instance[check.field], '', '', check.field)
    if (result === undefined || result === '') continue
    return false
  }
  return true
}

export async function AnalyzeFileToTable(file: File, headers: TableHeader[], notify: any): Promise<any> {
  if (file === null || file === undefined) {
    notify({ type: 'warn', title: '提示', text: '还未选择文件！' })
    return
  }
  const workbook = XLSX.read(await file?.arrayBuffer())
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const rawData = XLSX.utils.sheet_to_json(worksheet)

  const fieldKeyMap = headers.reduce((map, header) => {
    map.set(header.label, header.field)
    return map
  }, new Map())

  return rawData.map((row: any) => {
    const newRow: { [key: string]: any } = {}
    Object.keys(row).forEach((key) => (newRow[fieldKeyMap.get(key)] = row[key]))
    return newRow
  })
}

export const checkValid = (content: any) => {
  if (content === null || content === undefined) {
    return false
  }
  if (content === '') {
    return false
  }
  if (typeof content === 'string') {
    if (content.startsWith('§')) {
      return false
    }
  }
  return true
}
