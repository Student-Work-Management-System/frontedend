export { chLabel } from './table-label-ch'
export * from './base-import-header'

export interface TableHeader {
  type: string
  field: string
  label: string
  require: boolean
  options: any[] | null
  validate?: (content: any, oldContent: any, record: any, field: any) => string
}
