export default {
  path: '/scholarship',
  name: 'scholarship',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-medal',
    title: '奖学金记录',
    itemShow: false
  },
  children: [
    {
      path: '/scholarship/import',
      name: 'scholarship-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-upload-outline',
        title: '奖学金信息录入',
        itemShow: true
      }
    },
    {
      path: '/scholarship/list',
      name: 'scholarship-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-chart-bell-curve',
        title: '奖学金信息统计',
        itemShow: true
      }
    },
    {
      path: '/scholarship/manage',
      name: 'scholarship-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '奖学金信息管理',
        itemShow: true
      }
    }
  ]
}
