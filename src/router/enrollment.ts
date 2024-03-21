export default {
  path: '/enrollment',
  name: 'enrollment',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-bus-school',
    itemShow: false,
    title: '学生招生信息'
  },
  children: [
    {
      path: '/enrollment/import',
      name: 'enrollment-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-upload-outline',
        title: '招生信息录入',
        itemShow: true
      }
    },
    {
      path: '/enrollment/list',
      name: 'enrollment-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-chart-bell-curve',
        title: '招生信息统计',
        itemShow: true
      }
    },
    {
      path: '/enrollment/manage',
      name: 'enrollment-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '招生信息管理',
        itemShow: true
      }
    }
  ]
}
