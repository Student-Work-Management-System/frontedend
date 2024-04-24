import { type TableHeader } from '.'
import { type StudentCadre  } from '@/api/cadre'
export interface StudentCadreHeader extends StudentCadre {
  [key: string]: any,
  cadrePosition :any,
  cadreLevel :any
}

export const studentcadreheaders: TableHeader[] = [
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
    field: 'cadrePosition',
    label: '具体职位',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '具体职位不能为空！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'cadreLevel',
    label: '职位等级',
    require: true,
    options: [
        '校级',
        '院级',
        '班级'
    ],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '职位等级不能为空！'
      if (!/^校级$|^院级$|^班级$/.test(content)) return '职位等级错误！'
      return ''
    }
  },
  {
    type: 'select',
    field: 'appointmentStartTerm',
    label: '开始学期',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '格式应该为2xxx-2xxxx_x'
      if (!/^2\d{3}-2\d{3}_(1|2)$/.test(content)) return '格式应该为2xxx-2xxxx_x'
      return ''
    }
  },
  {
    type: 'select',
    field: 'appointmentEndTerm',
    label: '结束学期',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '格式应该为2xxx-2xxxx_x'
      if (!/^2\d{3}-2\d{3}_(1|2)$/.test(content)) return '格式应该为2xxx-2xxxx_x'
      return ''
    }
  },
  {
    type: 'string',
    field: 'comment',
    label: '备注',
    require: false,
    options: null
  },
  
]
