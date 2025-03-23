export default {
  path: '/poverty',
  name: 'poverty',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-sprout',
    title: '学生贫困资助',
    hasPage: false,
    auth: 'poverty_assistance:select'
  },
  children: [
    {
      path: '/poverty/import',
      name: 'poverty-import',
      component: () => import('@/views/home/poverty/PovertyImportTabs.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '贫困信息录入',
        hasPage: true,
        auth: 'poverty_assistance:insert'
      }
    },
    {
      path: '/poverty/list',
      name: 'poverty-list',
      component: () => import('@/views/home/poverty/PovertyStatusTab.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '贫困信息统计',
        hasPage: true,
        auth: 'student_poverty_assistance:select'
      }
    },
    {
      path: '/poverty/manage',
      name: 'poverty-manage',
      component: () => import('@/views/home/poverty/PovertyManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '贫困信息管理',
        hasPage: true,
        auth: 'poverty_assistance:update'
      }
    }
  ]
}
