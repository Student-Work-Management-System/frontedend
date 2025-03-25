export default {
    path: '/foreign',
    name: 'foreign',
    component: () => import('@/components/basic/RouterContainer.vue'),
    meta: {
        icon: 'mdi-web',
        title: '外语等级成绩统计',
        hasPage: false,
        auth: 'foreign:select'
    },
    children: [
        {
            path: '/foreign/import',
            name: 'foreign-import',
            component: () => import('@/views/home/foreign/ForeignLanguageImport.vue'),
            meta: {
                icon: 'mdi-plus-box-multiple',
                title: '外语等级成绩录入',
                hasPage: true,
                auth: 'foreign:insert'
            }
        },
        {
            path: '/foreign/tab',
            name: 'foreign-tab',
            component: () => import('@/views/home/foreign/ForeignLanguageTab.vue'),
            meta: {
                icon: 'mdi-plus-box-multiple',
                title: '外语等级成绩统计',
                hasPage: true,
                auth: 'foreign:select'
            }
        },
        {
            path: '/foreign/manage',
            name: 'foreign-manage',
            component: () => import('@/views/home/foreign/LanguageManage.vue'),
            meta: {
                icon: 'mdi-chart-bar',
                title: '外语类别管理',
                hasPage: true,
                auth: 'foreign:select'
            }
        }
    ]
}
