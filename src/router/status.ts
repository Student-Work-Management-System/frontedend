export default {
  path: '/status',
  name: 'status',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-school',
    hasPage: false,
    auth: 'student_status:select',
    title: '学生学籍变动'
  },
  children: [
    {
      path: '/status/import',
      name: 'status-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '学籍信息录入',
        hasPage: true,
        auth: 'student_status:insert'
      }
    },
    {
      path: '/status/list',
      name: 'status-list',
      component: () => import('@/views/home/base/tab/BaseInfoData.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '学籍信息统计',
        hasPage: true,
        auth: 'student_status:select'
      }
    },
    {
      path: '/status/manage',
      name: 'status-manage',
      component: () => import('@/views/home/base/tab/BaseInfoData.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '学籍信息管理',
        hasPage: true,
        auth: 'student_status:update'
      }
    }
  ]
}
