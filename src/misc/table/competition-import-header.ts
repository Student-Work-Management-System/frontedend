/* eslint-disable @typescript-eslint/no-unused-vars */
import { type TableHeader } from '.'
import type { Competition } from '@/model/competitionModel'

export interface CompetitionHeader extends Competition {
  [key: string]: any
}

export const competitionTableHeaders = [
  {
    title: '竞赛名称',
    align: 'start',
    sortable: true,
    key: 'competitionName'
  },
  {
    title: '竞赛性质',
    align: 'start',
    sortable: true,
    key: 'competitionNature'
  },
  {
    title: '竞赛类别',
    align: 'start',
    sortable: true,
    key: 'competitionType'
  },
  {
    title: '备注',
    align: 'start',
    sortable: true,
    key: 'comment'
  },
  {
    title: '操作',
    align: 'center',
    key: 'operations',
    sortable: false
  }
]

export const studentCompetitionTableHeaders = [
  {
    title: '竞赛名称',
    align: 'start',
    sortable: true,
    key: 'competitionName'
  },
  {
    title: '竞赛性质',
    align: 'start',
    sortable: false,
    key: 'competitionNature'
  },
  {
    title: '竞赛类别',
    align: 'start',
    sortable: false,
    key: 'competitionType'
  },
  {
    title: '填报人学号',
    align: 'start',
    sortable: false,
    key: 'headerId'
  },
  {
    title: '填报人姓名',
    align: 'start',
    sortable: false,
    key: 'headerName'
  },
  {
    title: '奖项级别',
    align: 'start',
    sortable: false,
    key: 'level'
  },
  {
    title: '获奖日期',
    align: 'start',
    sortable: true,
    key: 'date'
  },
  {
    title: '审核状态',
    align: 'start',
    sortable: false,
    key: 'state'
  },
  {
    title: '驳回原因',
    align: 'start',
    sortable: false,
    key: 'rejectReason'
  },
  {
    title: '操作',
    align: 'center',
    sortable: false,
    key: 'operations'
  }
]

export const competitionHeaders: TableHeader[] = [
  {
    type: 'string',
    field: 'competitionName',
    label: '竞赛名称',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '竞赛名称不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'select',
    field: 'competitionNature',
    label: '竞赛性质',
    require: true,
    options: ["团队", "单人"],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '竞赛性质不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'select',
    field: 'competitionType',
    label: '竞赛类别',
    require: true,
    options: ["A类", "B类", "C类", "D类", "其他"],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '竞赛类别不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'comment',
    label: '备注',
    require: false,
    options: null,
  }

]
