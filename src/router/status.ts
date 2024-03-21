export default {
  path: '/status',
  name: 'status',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-clipboard-text-multiple',
    itemShow: false,
    title: '学生学籍变动'
  },
  children: [
    {
      path: '/status/import',
      name: 'status-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-import',
        title: '学籍信息录入',
        itemShow: true
      }
    },
    {
      path: '/status/list',
      name: 'status-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '学籍信息统计',
        itemShow: true
      }
    },
    {
      path: '/status/manage',
      name: 'status-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '学籍信息管理',
        itemShow: true
      }
    }
  ]
}
