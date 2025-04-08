export default {
  path: '/employment',
  name: 'employment',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-briefcase',
    title: '学生就业统计',
    hasPage: false,
    auth: 'student_employment:select'
  },
  children: [
    {
      path: '/employment/import',
      name: 'employment-import',
      component: () => import('@/views/home/employment/EmploymentImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '就业信息录入',
        hasPage: true,
        auth: 'student_employment:insert'
      }
    },
    {
      path: '/employment/list',
      name: 'employment-list',
      component: () => import('@/views/home/employment/EmploymentTabs.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '就业信息统计',
        hasPage: true,
        auth: 'student_employment:select'
      }
    },
  ]
}
