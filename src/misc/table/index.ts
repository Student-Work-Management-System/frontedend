import * as XLSX from 'xlsx'

export { chLabel } from './table-label-ch'
export * from './base-import-header'
export * from './employ-import-header'

export interface TableHeader {
  type: string
  field: string
  label: string
  require: boolean
  options: any[] | null
  validate?: (content: any, oldContent: any, record: any, field: any) => string
}

export async function AnalyzeFileToTable(file: File, headers: TableHeader[], notify: any): Promise<TableHeader[]> {
  if (file === null || file === undefined) {
    notify({ type: 'warn', title: '提示', text: '还未选择文件！' })
    return []
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
  }) as TableHeader[]
}
