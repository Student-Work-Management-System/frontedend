import { type TableHeader } from '.'
import type { Enrollment } from '@/api/enroll'

export interface EnrollHeader extends Enrollment {
  [key: string]: any
}

export const enrollheaders: TableHeader[] = [
  {
    type: 'string',
    field: 'examineeId',
    label: '准考证号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '准考证号不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'id',
    label: '身份证号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '毕业状态不能为空！'
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
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'origin',
    label: '生源地',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '生源地不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'enrollSchool',
    label: '录取学院',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '录取学院不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'enrollMajor',
    label: '录取专业',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '录取专业不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'firstMajor',
    label: '第一志愿专业',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '第一志愿专业不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'score',
    label: '高考分数',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (isNaN(Number(content))) return '数字！'
      return '' // return empty string if there is no error
    }
  },

]
