export default {
  path: '/base',
  name: 'base',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-clipboard-text-multiple',
    title: '学生基本信息',
    itemShow: false
  },
  children: [
    {
      path: '/base/import',
      name: 'base-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-import',
        title: '基本信息录入',
        itemShow: true
      }
    },
    {
      path: '/base/manage',
      name: 'base-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '基本信息管理',
        itemShow: true
      }
    }
  ]
}
