export default {
  path: '/cadre',
  name: 'cadre',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-clipboard-text-multiple',
    title: '学生干部信息',
    itemShow: false
  },
  children: [
    {
      path: '/cadre/import',
      name: 'cadre-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-import',
        title: '职位信息录入',
        itemShow: true
      }
    },
    {
      path: '/cadre/list',
      name: 'cadre-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '职位信息统计',
        itemShow: true
      }
    },
    {
      path: '/cadre/manage',
      name: 'cadre-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '职位任期管理',
        itemShow: true
      }
    }
  ]
}
