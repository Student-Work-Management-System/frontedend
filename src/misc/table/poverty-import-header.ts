/* eslint-disable @typescript-eslint/no-unused-vars */
import { type TableHeader } from '.'
import { type PovertyAssistance, type StudentPovertyAssistance } from '@/model/povertyModel'
export interface PovertyHeader extends PovertyAssistance {
  [key: string]: any,
}

export interface StudentPovertyHeader extends StudentPovertyAssistance {
  [key: string]: any,
}

export const povertyTableHeaders = [
  {
    title: '贫困类型ID',
    align: 'start',
    sortable: true,
    key: 'povertyAssistanceId'
  },
  {
    title: '贫困类型',
    align: 'start',
    sortable: false,
    key: 'povertyType'
  },
  {
    title: '贫困等级',
    align: 'start',
    sortable: false,
    key: 'povertyLevel'
  },
  {
    title: '资助标准',
    align: 'start',
    sortable: false,
    key: 'povertyAssistanceStandard'
  },
  {
    title: '操作',
    align: 'center',
    sortable: false,
    key: 'operations'
  }
]

export const povertyHeaders: TableHeader[] = [
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
    type: 'select',
    field: 'povertyLevel',
    label: '贫困等级',
    require: true,
    options: [
      '特别困难',
      '比较困难',
      '一般困难'
    ],
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

export const studentPovertyHeaders: TableHeader[] = [
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
      if (!/^2\d{3}-2\d{3}$/.test(content)) return '格式应该为2xxx-2xxx'
      return ''
    }
  },
  {
    type: 'select',
    field: 'povertyAssistanceInfo',
    label: '贫困信息',
    require: true,
    options: [],
  },
]

export const studentPovertyTableHeaders = [
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
    title: '贫困类型',
    align: 'start',
    sortable: true,
    key: 'povertyType'
  },
  {
    title: '贫困级别',
    align: 'start',
    sortable: false,
    key: 'povertyLevel'
  },
  {
    title: '资助标准',
    align: 'start',
    sortable: false,
    key: 'povertyAssistanceStandard'
  },
  {
    title: '认证学年',
    align: 'start',
    sortable: false,
    key: 'assistanceYear'
  },
  {
    title: '操作',
    align: 'start',
    sortable: false,
    key: 'operations'
  }
]