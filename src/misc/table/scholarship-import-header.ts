/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TableHeader } from ".";
import type { StudentScholarship } from "@/model/scholarshipModel";


export interface StudentScholarshipHeader extends StudentScholarship {
    [key: string]: any
}

export const scholarshipTableHeaders = [
    {
        title: "奖学金id",
        align: 'start',
        sortable: true,
        key: 'scholarshipId'
    },
    {
        title: "奖学金名称",
        align: 'start',
        sortable: true,
        key: 'scholarshipName'
    },
    {
        title: "奖学金级别",
        align: 'start',
        sortable: true,
        key: 'scholarshipLevel'
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]

export const studentScholarshipTableHeaders = [
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
        title: "奖学金名称",
        align: 'start',
        sortable: true,
        key: 'scholarshipName'
    },
    {
        title: "奖学金级别",
        align: 'start',
        sortable: true,
        key: 'scholarshipLevel'
    },
    {
        title: "获奖日期",
        align: 'start',
        sortable: true,
        key: 'awardYear'
    },
    {
        title: '操作',
        align: 'center',
        sortable: false,
        key: 'operations'
    }
]

export const studentScholarHeader: TableHeader[] = [
    {
        type: 'string',
        field: 'studentId',
        label: '学生学号',
        require: true
    },
    {
        type: 'string',
        field: 'awardYear',
        label: '获奖时间',
        require: true,
        validate: (content, oldContent, record, field) => {
            if (content === '') return '格式应该为2xxx-2xxx_x'
            if (!/^2\d{3}-2\d{3}$/.test(content)) return '格式应该为2xxx-2xxx'
            return ''
        }
    },
    {
        type: 'select',
        field: "scholarshipInfo",
        label: '奖学金',
        require: true,
        options: []
    }
]