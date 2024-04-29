import { type TableHeader } from '.'
import { type StudentPovertyAssistance  } from '@/api/poverty'
export interface StudentPovertyHeader extends StudentPovertyAssistance {
  [key: string]: any,
  povertyLevel: any,
  povertyType: any
}

export const studentpovertyheaders: TableHeader[] = [
  {
    type: 'string',
    field: 'studentId',
    label: '学号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '学号不能为空！'
      return '' 
    }
  },
  {
    type: 'string',
    field: 'assistanceYear',
    label: '认证学年',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '认证学年不能为空！'
      if (!/^2\d{3}-2\d{3}$/.test(content)) return '格式应该为2xxx-2xxxx'
      return ''
    }
  },
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
]
