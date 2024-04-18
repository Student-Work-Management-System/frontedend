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
      component: () => import('@/views/home/employment/EmployImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '就业信息录入',
        hasPage: true,
        auth: 'student_employment:insert'
      }
    },
    {
      path: '/base/list',
      name: 'employment-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '就业信息统计',
        hasPage: true,
        auth: 'student_employment:select'
      }
    },
    {
      path: '/base/manage',
      name: 'employment-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '就业信息管理',
        hasPage: true,
        auth: 'student_employment:update'
      }
    }
  ]
}
