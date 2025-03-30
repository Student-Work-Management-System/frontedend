import type { StudentStatus } from '@/model/statusModel'
import { type TableHeader } from '.'
export interface StudentStatusHeader extends StudentStatus {
    [key: string]: any,
}

export const studentStatusHeader: TableHeader[] = [

]

export const statusTableHeaders = [
    {
        title: '学籍状态id',
        align: 'start',
        sortable: true,
        key: 'statusId'
    },
    {
        title: '学籍状态名',
        align: 'start',
        sortable: false,
        key: 'statusName'
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]