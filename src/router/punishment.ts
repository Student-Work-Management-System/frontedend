export default {
  path: '/punishment',
  name: 'punishment',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-cancel',
    title: '学生处分情况',
    hasPage: false,
    auth: 'student_punishment:select'
  },
  children: [
    {
      path: '/punishment/import',
      name: 'punishment-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '处分信息录入',
        hasPage: true,
        auth: 'student_punishment:insert'
      }
    },
    {
      path: '/punishment/list',
      name: 'punishment-list',
      component: () => import('@/views/home/base/BaseInfoData.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '处分信息统计',
        hasPage: true,
        auth: 'student_punishment:select'
      }
    },
    {
      path: '/punishment/manage',
      name: 'punishment-manage',
      component: () => import('@/views/home/base/BaseInfoData.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '处分信息管理',
        hasPage: true,
        auth: 'student_punishment:update'
      }
    }
  ]
}
