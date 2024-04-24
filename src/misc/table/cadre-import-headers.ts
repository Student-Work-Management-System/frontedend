import { type TableHeader } from '.'
import { type Cadre  } from '@/api/cadre'
export interface CadreHeader extends Cadre {
  [key: string]: any,

}

export const cadreheaders: TableHeader[] = [
 
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
