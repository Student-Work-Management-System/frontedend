import { type TableHeader } from '.'
import type { Competition } from '@/api/competition'

export interface CompetitionHeader extends Competition {
  [key: string]: any
}

export const competitionheaders: TableHeader[] = [
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
    field: 'competitionLevel',
    label: '竞赛等级',
    require: true,
    options: ["A类", "B类", "C类", "D类", "其他"],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '竞赛等级不能为空！'
      return '' // return empty string if there is no error
    }
  },
]
