/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StudentEmployment } from '@/model/employmentModel'
import { type TableHeader } from '.'
import { stateOption, whereaboutsOption } from '@/api/employment'

export interface EmploymentHeader extends StudentEmployment {
  [key: string]: any
}

export const employmentHeaders: TableHeader[] = [
  {
    type: 'string',
    field: 'studentId',
    label: '学号',
    require: true,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '学号不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'graduationYear',
    label: '毕业年份',
    require: false,
  },
  {
    type: 'select',
    field: 'whereabouts',
    label: '毕业去向',
    require: true,
    options: whereaboutsOption,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '毕业去向不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'code',
    label: '单位组织机构代码',
    require: false,
  },
  {
    type: 'string',
    field: 'organizationName',
    label: '单位名称',
    require: false,
  },
  {
    type: 'string',
    field: 'jobNature',
    label: '工作性质',
    require: false,
  },
  {
    type: 'string',
    field: 'jobIndustry',
    label: '所处行业',
    require: false,
  },
  {
    type: 'string',
    field: 'jobLocation',
    label: '工作地点',
    require: false,
  },
  {
    type: 'string',
    field: 'category',
    label: '职业类别',
    require: false,
  },
  {
    type: 'string',
    field: 'salary',
    label: '月薪',
    require: false,
    validate: (content, oldContent, record, field) => {
      if (isNaN(Number(content))) return '数字！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'select',
    field: 'state',
    label: '毕业状态',
    require: true,
    options: stateOption,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '毕业状态不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    label: "单位联系人",
    field: 'contactPerson',
    require: false
  },
  {
    type: 'string',
    label: "单位联系方式",
    field: 'contactPhone',
    require: false
  },
  {
    type: 'date',
    label: "就业证明日期",
    field: 'certificateTime',
    require: false
  },
]

export const employmentTableHeaders = [
  {
    label: '身份证',
    align: 'center',
    sortable: false,
    key: 'idNumber',
    width: 225,
    showOverflowTooltip: false
  },
  {
    label: '民族',
    align: 'center',
    sortable: false,
    key: 'nation',
    width: 100,
    showOverflowTooltip: false
  },
  {
    label: '专业',
    align: 'center',
    sortable: false,
    key: 'majorName',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '年级',
    align: 'center',
    sortable: false,
    key: 'gradeName',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '培养层次',
    align: 'center',
    sortable: false,
    key: 'degreeName',
    width: 100,
    showOverflowTooltip: false
  },
  {
    label: '政治面貌',
    align: 'center',
    sortable: false,
    key: 'politicStatus',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '生源地',
    align: 'center',
    sortable: false,
    key: 'studentFrom',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '入学时间',
    align: 'center',
    sortable: false,
    key: 'enrollmentTime',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '班级',
    align: 'center',
    sortable: false,
    key: 'classNo',
    width: 100,
    showOverflowTooltip: false
  },
  {
    label: '家庭地址',
    align: 'center',
    sortable: false,
    key: 'location',
    width: 450,
    showOverflowTooltip: false
  },
  {
    label: '毕业年份',
    align: 'center',
    sortable: false,
    key: 'graduationYear',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '毕业生类别',
    align: 'center',
    sortable: false,
    key: 'householdType',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '毕业去向',
    align: 'center',
    sortable: false,
    key: 'whereabouts',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '单位名称',
    align: 'center',
    sortable: false,
    key: 'organizationName',
    width: 400,
    showOverflowTooltip: false
  },
  {
    label: '单位组织机构代码',
    align: 'center',
    sortable: false,
    key: 'code',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '工作性质',
    align: 'center',
    sortable: false,
    key: 'jobNature',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '所处行业',
    align: 'center',
    sortable: false,
    key: 'jobIndustry',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '工作地点',
    align: 'center',
    sortable: false,
    key: 'jobLocation',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '职业类别',
    align: 'center',
    sortable: false,
    key: 'category',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '月薪',
    align: 'center',
    sortable: false,
    key: 'salary',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '单位联系人',
    align: 'center',
    sortable: false,
    key: 'contactPerson',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '单位联系方式',
    align: 'center',
    sortable: false,
    key: 'contactPhone',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '就业证明时间',
    align: 'center',
    sortable: false,
    key: 'certificateTime',
    width: 150,
    showOverflowTooltip: false
  },
  {
    label: '毕业状态',
    align: 'center',
    sortable: true,
    key: 'state',
    width: 150,
    showOverflowTooltip: false
  },
]