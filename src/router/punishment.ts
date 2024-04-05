export default {
  path: '/punishment',
  name: 'punishment',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-cancel',
    title: '学生处分情况',
    hasPage: false,
    auth: 'poverty_assistance:select'
  },
  children: [
    {
      path: '/punishment/import',
      name: 'punishment-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-upload-outline',
        title: '处分信息录入',
        hasPage: true,
        auth: 'poverty_assistance:insert'
      }
    },
    {
      path: '/punishment/list',
      name: 'punishment-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-chart-bell-curve',
        title: '处分信息统计',
        hasPage: true,
        auth: 'poverty_assistance:select'
      }
    },
    {
      path: '/punishment/manage',
      name: 'punishment-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '处分信息管理',
        hasPage: true,
        auth: 'poverty_assistance:update'
      }
    }
  ]
}
