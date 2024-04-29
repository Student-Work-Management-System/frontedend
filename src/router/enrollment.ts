export default {
  path: '/enrollment',
  name: 'enrollment',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-bus-school',
    hasPage: false,
    auth: 'enrollment:select',
    title: '学生招生信息'
  },
  children: [
    {
      path: '/enrollment/import',
      name: 'enrollment-import',
      component: () => import('@/views/home/enrollment/EnrollImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '招生信息录入',
        hasPage: true,
        auth: 'enrollment:insert'
      }
    },
    {
      path: '/enrollment/list',
      name: 'enrollment-list',
      // component: () => import('@/views/home/enrollment/EnrollDataTabs.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '招生信息统计',
        hasPage: true,
        auth: 'enrollment:select'
      }
    },
  ]
}
