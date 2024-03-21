export default {
  path: '/punishment',
  name: 'punishment',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-clipboard-text-multiple',
    title: '学生处分情况',
    itemShow: false
  },
  children: [
    {
      path: '/punishment/import',
      name: 'punishment-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-import',
        title: '处分信息录入',
        itemShow: true
      }
    },
    {
      path: '/punishment/list',
      name: 'punishment-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '处分信息统计',
        itemShow: true
      }
    },
    {
      path: '/punishment/manage',
      name: 'punishment-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '处分信息管理',
        itemShow: true
      }
    }
  ]
}
