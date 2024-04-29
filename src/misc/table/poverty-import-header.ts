import { type TableHeader } from '.'
import { type PovertyAssistance  } from '@/api/poverty'
export interface PovertyHeader extends PovertyAssistance {
  [key: string]: any,

}

export const povertyheaders: TableHeader[] = [
 
  {
    type: 'string',
    field: 'povertyType',
    label: '贫困类型',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '贫困类型不能为空！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'povertyLevel',
    label: '贫困等级',
    require: true,
    options: [
        '特别困难',
        '比较困难',
        '一般困难'
    ],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '职位等级不能为空！'
      if (!/^特别困难$|^比较困难$|^一般困难$/.test(content)) return '贫困等级等级错误！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'povertyAssistanceStandard',
    label: '资助标准',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '资助标准不能为空！'
      return ''
    }
  },
  
]
