export default {
  path: '/precaution',
  name: 'precaution',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-shield-alert-outline',
    hasPage: false,
    auth: 'student_precaution:select',
    title: '学业预警信息'
  },
  children: [
    {
      path: '/precaution/import',
      name: 'precaution-import',
      component: () => import('@/views/home/precaution/PrecautionImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '预警信息录入',
        hasPage: true,
        auth: 'student_precaution:insert'
      }
    },
    {
      path: '/precaution/list',
      name: 'precaution-list',
      component: () => import('@/views/home/precaution/PrecautionTabs.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '预警信息统计',
        hasPage: true,
        auth: 'student_precaution:select'
      }
    }
  ]
}
