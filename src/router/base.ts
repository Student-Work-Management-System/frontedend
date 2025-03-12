export default {
  path: '/base',
  name: 'base',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-camera-account',
    title: '学生基本信息',
    hasPage: false,
    auth: 'student:select'
  },
  children: [
    {
      path: '/base/import',
      name: 'base-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '基本信息录入',
        hasPage: true,
        auth: 'student:insert'
      }
    },
    {
      path: '/base/status',
      name: 'base-status',
      component: () => import('@/views/home/base/BaseInfoStatus.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '基本信息统计',
        hasPage: true,
        auth: 'student:select'
      }
    },
    {
      path: '/base/manage',
      name: 'base-manage',
      component: () => import('@/views/home/base/BaseInfoData.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '基本信息管理',
        hasPage: true,
        auth: 'student:update'
      }
    }
  ]
}
