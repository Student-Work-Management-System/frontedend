import type { TableHeader } from ".";
import type { StudentPunishment } from "@/model/punishmentModel";

export interface StudentPunishmentHeader extends StudentPunishment {
    [key: string]: any
}

export const studentPunishmentHeaders: TableHeader[] = [
    {
        type: 'string',
        field: 'studentId',
        label: '学生学号',
        require: true
    },
    {
        type: 'select',
        field: 'level',
        label: '处分级别',
        require: true,
        options: []
    },
    {
        type: 'string',
        field: 'reason',
        label: '处分原因',
        require: true
    },
]

export const punishmentTableHeaders = [
    {
        title: '处分编号',
        key: 'punishmentId',
        align: 'center',
        sortable: false,
    },
    {
        title: '处分名称',
        key: 'punishmentName',
        align: 'center',
        sortable: false,
    },
    {
        title: '操作',
        key: 'operations',
        align: "center",
        sortable: false,
    }
]

export const studentPunishmentTableHeaders = [
    {
        title: "学生学号",
        align: 'center',
        sortable: true,
        key: 'studentId'
    },
    {
        title: "学生姓名",
        align: 'center',
        sortable: true,
        key: 'name'
    },
    {
        title: "年级",
        align: 'center',
        sortable: true,
        key: 'gradeName'
    },
    {
        title: "专业",
        align: 'center',
        sortable: true,
        key: 'majorName'
    },
    {
        title: "处分原因",
        align: 'center',
        sortable: true,
        key: 'reason'
    },
    {
        title: "处分级别",
        align: 'center',
        sortable: true,
        key: 'punishmentName'
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]

