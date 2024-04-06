export default {
  path: '/precaution',
  name: 'precaution',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-shield-alert-outline',
    hasPage: false,
    auth: 'student_school_precaution:select',
    title: '学业预警信息'
  },
  children: [
    {
      path: '/precaution/import',
      name: 'precaution-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '预警信息录入',
        hasPage: true,
        auth: 'student_school_precaution:insert'
      }
    },
    {
      path: '/precaution/list',
      name: 'precaution-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '预警信息统计',
        hasPage: true,
        auth: 'student_school_precaution:select'
      }
    },
    {
      path: '/precaution/manage',
      name: 'precaution-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '预警信息管理',
        hasPage: true,
        auth: 'student_school_precaution:update'
      }
    }
  ]
}
