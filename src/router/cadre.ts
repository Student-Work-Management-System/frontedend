export default {
  path: '/cadre',
  name: 'cadre',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-account-tie',
    title: '学生干部信息',
    itemShow: false
  },
  children: [
    {
      path: '/cadre/import',
      name: 'cadre-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-upload-outline',
        title: '职位信息录入',
        itemShow: true
      }
    },
    {
      path: '/cadre/list',
      name: 'cadre-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-chart-bell-curve',
        title: '职位信息统计',
        itemShow: true
      }
    },
    {
      path: '/cadre/manage',
      name: 'cadre-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '职位任期管理',
        itemShow: true
      }
    }
  ]
}
