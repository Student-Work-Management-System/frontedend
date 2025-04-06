/* eslint-disable @typescript-eslint/no-unused-vars */
import { type TableHeader } from '.'
import { type ForeignLanguage } from '@/model/foreignModel'

export interface ForeignLanguageHeader extends ForeignLanguage {
    [key: string]: any,
}

export const foreignLanguageHeaders: TableHeader[] = [
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
        field: 'languageInfo',
        label: '语言',
        require: true,
        options: [],
    },
    {
        type: 'string',
        field: 'score',
        label: '成绩',
        require: true,
        options: null,
    },
    {
        type: 'string',
        field: 'date',
        label: '考试日期',
        require: true,
        options: null,
        validate: (content, oldContent, record, field) => {
            if (content === '') return '格式应该为2xxx-2xxx_x'
            if (!/^2\d{3}-2\d{3}_(1|2)$/.test(content)) return '格式应该为2xxx-2xxx_x'
            return ''
        }
    },
    {
        type: 'string',
        field: 'certificate',
        label: '证书编号',
        require: false,
        options: null,
    },
]

export const languageTableHeaders = [
    {
        title: '语言ID',
        align: 'start',
        sortable: true,
        key: 'languageId'
    },
    {
        title: '语言名称',
        align: 'start',
        sortable: false,
        key: 'languageName'
    },
    {
        title: '语言类型',
        align: 'start',
        sortable: false,
        key: 'type'
    },
    {
        title: '满分',
        align: 'start',
        sortable: false,
        key: 'total'
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]

export const foreignLanguageTableHeaders = [
    {
        title: '学号',
        align: 'start',
        sortable: true,
        key: 'studentId'
    },
    {
        title: '姓名',
        align: 'start',
        sortable: true,
        key: 'name'
    },
    {
        title: '专业',
        align: 'start',
        sortable: true,
        key: 'majorName'
    },
    {
        title: '年级',
        align: 'start',
        sortable: true,
        key: 'gradeName'
    },
    {
        title: '语言名称',
        align: 'start',
        sortable: true,
        key: 'languageName'
    },
    {
        title: '类型',
        align: 'start',
        sortable: true,
        key: 'type'
    },
    {
        title: '成绩',
        align: 'start',
        sortable: true,
        key: 'score'
    },
    {
        title: '考试日期',
        align: 'start',
        sortable: true,
        key: 'date'
    },
    {
        title: '证书编号',
        align: 'start',
        sortable: true,
        key: 'certificate'
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]