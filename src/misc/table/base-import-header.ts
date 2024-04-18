import { type TableHeader } from '.'
import { type Student } from '@/api/student'
export interface BaseHeader extends Student {
  [key: string]: any
}

export const baseheaders: TableHeader[] = [
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
    field: 'name',
    label: '姓名',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '姓名不能为空！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'idNumber',
    label: '身份证号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '身份证号不能为空！'
      if (
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(content)
      )
        return '身份证格式错误！'
      return ''
    }
  },
  {
    type: 'select',
    field: 'gender',
    label: '性别',
    require: true,
    options: ['男', '女'],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '性别不能为空！'
      if (!/^[男女]$/.test(content)) return '性别错误！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'nativePlace',
    label: '籍贯',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'postalCode',
    label: '邮政编码',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'politicsStatus',
    label: '政治面貌',
    require: true,
    options: ['群众', '共青团员', '中共党员'],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '政治面貌不能为空！'
      if (!['群众', '共青团员', '中共党员'].includes(content)) return '政治面貌错误！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'phone',
    label: '手机号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '手机号不能为空！'
      if (
        !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
          content
        )
      )
        return '手机号格式错误！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'nation',
    label: '民族',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'majorName',
    label: '专业名称',
    require: true,
    options: [
      '计算机科学与技术',
      '软件工程',
      '信息安全',
      '物联网工程',
      '智能科学与技术',
      '网络空间安全'
    ],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '专业名称不能为空！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'grade',
    label: '年级',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '年级不能为空！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'classNo',
    label: '班级号',
    require: false,
    options: null
  }
]
