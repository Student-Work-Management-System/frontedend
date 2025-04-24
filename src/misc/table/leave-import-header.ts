export const leaveTableHeader = [
    {
        title: '年级',
        key: 'gradeName',
        align: 'center',
        sortable: false,
        width: 120,
        showOverflowTooltip: true,
        formatter: null
    },
    {
        title: '专业',
        key: 'majorName',
        align: 'center',
        sortable: false,
        width: 240,
        showOverflowTooltip: true,
        formatter: null
    },
    {
        title: '请假类型',
        key: 'type',
        align: 'center',
        sortable: false,
        width: 100,
        showOverflowTooltip: true,
        formatter: null
    },
    {
        title: '请假理由',
        key: 'reason',
        align: 'center',
        sortable: false,
        width: 240,
        showOverflowTooltip: true,
        formatter: null
    },
    {
        title: '目的地',
        key: 'target',
        align: 'center',
        sortable: false,
        width: 120,
        showOverflowTooltip: true,
        formatter: null
    },
    {
        title: '详细地址',
        key: 'targetDetail',
        align: 'center',
        sortable: false,
        width: 240,
        showOverflowTooltip: true,
        formatter: null
    },
    {
        title: '是否实习',
        key: 'internship',
        align: 'center',
        sortable: false,
        width: 120,
        showOverflowTooltip: true,
        formatter: (_row: any, _column: any, cellValue: boolean) => cellValue ? '是' : '否',
    },
    {
        title: '起始日期',
        key: 'startDay',
        align: 'center',
        sortable: false,
        width: 120,
        showOverflowTooltip: true,
        formatter: null
    },
    {
        title: '结束日期',
        key: 'endDay',
        align: 'center',
        sortable: false,
        width: 120,
        showOverflowTooltip: true,
        formatter: null
    },
]
