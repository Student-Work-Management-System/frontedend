import { type TableHeader } from '.'
export interface CetHeader {
  [key: string]: any
  studentId: string
  score: string
  examDate: string
  certificateNumber: string
  examType: string
}

export function CetHeaderChecker(Cet: CetHeader): boolean {
  for (const check of cetheaders) {
    const result = check.validate?.(Cet[check.field], '', '', check.field)
    if (result === undefined || result === '') continue
    return false
  }
  return true
}

export const cetheaders: TableHeader[] = [
  {
    type: 'string',
    field: 'studentId',
    label: '学号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '学号不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'score',
    label: '成绩',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (isNaN(Number(content))) return '成绩必须为数字！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'examDate',
    label: '学期',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '学期不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'certificateNumber',
    label: '证书编号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '证书编号不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'select',
    field: 'examType',
    label: '考试类别',
    require: true,
    options: ['CET4', 'CET6'],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '考试类别不能为空！'
      if (!/^CET[4|6]$/.test(content)) return '考试类别错误！'
      return ''
    }
  },

]
