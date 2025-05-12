/* eslint-disable @typescript-eslint/no-unused-vars */
import { type TableHeader } from '.'
import type { StudentPrecaution } from "@/model/precautionModel"

export interface StudentPrecautionHeader extends StudentPrecaution {
    [key: string]: any,
}

export const studentPrecautionHeaders: TableHeader[] = [
    {
        type: 'string',
        field: 'studentId',
        label: '学号',
        require: true,
        options: null,
        validate: (content, oldContent, record, field) => {
            if (content === '') return '学号不能为空！'
            return ''
        }
    },
    {
        type: 'select',
        field: 'levelCode',
        label: '学业预警等级',
        require: true,
        options: ['红', '橙', '黄']
    },
    {
        type: 'string',
        field: 'term',
        label: '学业预警学期',
        require: true,
        options: null,
        validate: (content, oldContent, record, field) => {
            if (content === '') return '学业预警学期不能为空'
            if (!/^2\d{3}-2\d{3}_(1|2)$/.test(content)) return '请输入正确的学业预警学期格式, 例如: 2023-2024_1'
            return ''
        }
    },
    {
        type: 'string',
        field: 'detail',
        label: '学业预警明细',
        require: true,
        options: null
    },
]

export const studentPrecautionTableHeaders = [
    {
        title: '学号',
        align: 'center',
        sortable: true,
        key: 'studentId'
    },
    {
        title: '姓名',
        align: 'center',
        sortable: false,
        key: 'name'
    },
    {
        title: '年级',
        align: 'center',
        sortable: true,
        key: 'gradeName'
    },
    {
        title: '专业',
        align: 'center',
        sortable: false,
        key: 'majorName'
    },
    {
        title: '学业预警等级',
        align: 'center',
        sortable: false,
        key: 'levelCode'
    },
    {
        title: '学业预警学期',
        align: 'center',
        sortable: true,
        key: 'term'
    },
    {
        title: '是否处理',
        align: 'center',
        sortable: false,
        key: 'status'
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]

