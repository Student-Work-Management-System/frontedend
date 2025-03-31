import type { StudentStatus } from '@/model/statusModel'
import { type TableHeader } from '.'
export interface StudentStatusHeader extends StudentStatus {
    [key: string]: any,
}

export const statusHeader: TableHeader[] = [
    {
        type: "string",
        field: "studentId",
        label: "学号",
        require: true,
        options: null
    },
    {
        type: "select",
        field: "statusName",
        label: "学籍状态",
        require: true,
        options: []
    },
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

export const studentStatusTableHeader = [
    {
        title: "学号",
        align: "center",
        sortable: false,
        key: "studentId"
    },
    {
        title: "学生姓名",
        align: "center",
        sortable: false,
        key: "name"
    },
    {
        title: "专业",
        align: "center",
        sortable: false,
        key: "majorName"
    },
    {
        title: "年级",
        align: "center",
        sortable: false,
        key: "gradeName"
    },
    {
        title: "学籍状态",
        align: "center",
        sortable: false,
        key: "statusName"
    },
    {
        title: "变动记录",
        align: "center",
        sortable: false,
        key: "log"
    },
    {
        title: "变动时间",
        align: "center",
        sortable: false,
        key: "modifiedTime"
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]