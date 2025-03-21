/* eslint-disable @typescript-eslint/no-unused-vars */
import { type TableHeader } from '.'
import { type Cadre, type StudentCadre } from '@/model/cadreModel'
export interface CadreHeader extends Cadre {
  [key: string]: any,

}
export interface StudentCadreHeader extends StudentCadre {
  [key: string]: any,
  cadreInfo: string
}

export const studentCadreHeaders: TableHeader[] = [
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
    type: 'select',
    field: 'cadreInfo',
    label: '职位信息',
    require: true,
    options: [],
  },
  {
    type: 'select',
    field: 'appointmentStartTerm',
    label: '开始学期',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '格式应该为2xxx-2xxx_x'
      if (!/^2\d{3}-2\d{3}_(1|2)$/.test(content)) return '格式应该为2xxx-2xxx_x'
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
      if (content === '') return '格式应该为2xxx-2xxx_x'
      if (!/^2\d{3}-2\d{3}_(1|2)$/.test(content)) return '格式应该为2xxx-2xxx_x'
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

export const cadreHeaders: TableHeader[] = [
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

]

export const cadreTableHeaders = [
  {
    title: '职位ID',
    align: 'start',
    sortable: true,
    key: 'cadreId'
  },
  {
    title: '职位名称',
    align: 'start',
    sortable: false,
    key: 'cadrePosition'
  },
  {
    title: '职位级别',
    align: 'start',
    sortable: false,
    key: 'cadreLevel'
  },
  {
    title: '所属组织',
    align: 'start',
    sortable: false,
    key: 'cadreBelong'
  },
  {
    title: '操作',
    align: 'center',
    sortable: false,
    key: 'operations'
  }
]

export const studentCadreTableHeaders = [
  {
    title: '学号',
    align: 'start',
    sortable: true,
    key: 'studentId'
  },
  {
    title: '姓名',
    align: 'start',
    sortable: false,
    key: 'name'
  },
  {
    title: '性别',
    align: 'start',
    sortable: false,
    key: 'gender'
  },
  {
    title: '专业',
    align: 'start',
    sortable: false,
    key: 'majorName'
  },
  {
    title: '年级',
    align: 'start',
    sortable: true,
    key: 'gradeName'
  },
  {
    title: '具体职位',
    align: 'start',
    sortable: true,
    key: 'cadrePosition'
  },
  {
    title: '职位级别',
    align: 'start',
    sortable: false,
    key: 'cadreLevel'
  },
  {
    title: '所属组织',
    align: 'start',
    sortable: false,
    key: 'cadreBelong'
  },
  {
    title: '任职开始学期',
    align: 'start',
    sortable: false,
    key: 'appointmentStartTerm'
  },
  {
    title: '任职结束学期',
    align: 'start',
    sortable: false,
    key: 'appointmentEndTerm'
  },
  {
    title: '备注',
    align: 'start',
    sortable: false,
    key: 'comment'
  },
  {
    title: '操作',
    align: 'start',
    sortable: false,
    key: 'operations'
  }
]
