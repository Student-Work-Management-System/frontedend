import type { Employ } from '@/api/employ'
import { type TableHeader } from '.'

export interface EmployHeader extends Employ {
  [key: string]: any
}

export const employheaders: TableHeader[] = [
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
    type: 'select',
    field: 'graduationState',
    label: '毕业状态',
    require: true,
    options: ['就业', '待就业', '升学', '地方/国家基层项目', '科研/管理助理'],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '毕业状态不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'graduationYear',
    label: '毕业年份',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '毕业年份不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'whereabouts',
    label: '毕业去向',
    require: false,
    options: null,
  },
  {
    type: 'string',
    field: 'jobNature',
    label: '工作性质',
    require: false,
    options: null,
  },
  {
    type: 'string',
    field: 'jobIndustry',
    label: '所处行业',
    require: false,
    options: null,
  },
  {
    type: 'string',
    field: 'jobLocation',
    label: '工作地点',
    require: false,
    options: null,
  },
  {
    type: 'string',
    field: 'category',
    label: '职业类别',
    require: false,
    options: null,
  },
  {
    type: 'string',
    field: 'salary',
    label: '薪水',
    require: false,
    options: null,
  },

]
