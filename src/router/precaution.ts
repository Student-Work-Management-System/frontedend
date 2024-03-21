export default {
  path: '/precaution',
  name: 'precaution',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-clipboard-text-multiple',
    itemShow: false,
    title: '学业预警信息'
  },
  children: [
    {
      path: '/precaution/import',
      name: 'precaution-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-import',
        title: '预警信息录入',
        itemShow: true
      }
    },
    {
      path: '/precaution/list',
      name: 'precaution-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '预警信息统计',
        itemShow: true
      }
    },
    {
      path: '/precaution/manage',
      name: 'precaution-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '预警信息管理',
        itemShow: true
      }
    }
  ]
}
