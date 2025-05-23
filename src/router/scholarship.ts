export default {
  path: '/scholarship',
  name: 'scholarship',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-medal',
    title: '奖学金记录',
    hasPage: false,
    auth: 'student_scholarship:select'
  },
  children: [
    {
      path: '/scholarship/import',
      name: 'scholarship-import',
      component: () => import('@/views/home/scholarship/StudentScholarshipImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '奖学金信息录入',
        hasPage: true,
        auth: 'student_scholarship:insert'
      }
    },
    {
      path: '/scholarship/list',
      name: 'scholarship-list',
      component: () => import('@/views/home/scholarship/StudentScholarshipTab.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '奖学金信息统计',
        hasPage: true,
        auth: 'student_scholarship:select'
      }
    },
    {
      path: '/scholarship/manage',
      name: 'scholarship-manage',
      component: () => import('@/views/home/scholarship/ScholarManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '奖学金信息管理',
        hasPage: true,
        auth: 'student_scholarship:update'
      }
    }
  ]
}
