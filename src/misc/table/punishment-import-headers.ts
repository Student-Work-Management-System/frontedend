import type { TableHeader } from ".";
import type { StudentPunishment } from "@/model/punishmentModel";
import { levels } from "@/api/punishment";

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
        options: levels
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
        key: 'punishment',
        align: 'start',
        sortable: false,
    },
    {
        title: '处分名称',
        key: 'punishmentName',
        align: 'start',
        sortable: false,
    },
    {
        title: '处分等级',
        key: 'punishmentLevel',
        align: 'start',
        sortable: false,
    },
    {
        title: '操作',
        key: 'operations',
        sortable: false,
    }
]

export const studentPunishmentTableHeaders = [
    {
        title: "学生学号",
        align: 'start',
        sortable: true,
        key: 'studentId'
    },
    {
        title: "学生姓名",
        align: 'start',
        sortable: true,
        key: 'name'
    },
    {
        title: "年级",
        align: 'start',
        sortable: true,
        key: 'gradeName'
    },
    {
        title: "专业",
        align: 'start',
        sortable: true,
        key: 'majorName'
    },
    {
        title: "处分原因",
        align: 'start',
        sortable: true,
        key: 'reason'
    },
    {
        title: "处分级别",
        align: 'start',
        sortable: true,
        key: 'level'
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]

