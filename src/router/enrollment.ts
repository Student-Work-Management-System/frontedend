export default {
  path: '/enrollment',
  name: 'enrollment',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-bus-school',
    hasPage: false,
    auth: 'enrollment_info:select',
    title: '学生招生信息'
  },
  children: [
    {
      path: '/enrollment/import',
      name: 'enrollment-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '招生信息录入',
        hasPage: true,
        auth: 'enrollment_info:insert'
      }
    },
    {
      path: '/enrollment/list',
      name: 'enrollment-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '招生信息统计',
        hasPage: true,
        auth: 'enrollment_info:select'
      }
    },
    {
      path: '/enrollment/manage',
      name: 'enrollment-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '招生信息管理',
        hasPage: true,
        auth: 'enrollment_info:update'
      }
    }
  ]
}
