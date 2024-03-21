export default {
  path: '/poverty',
  name: 'poverty',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-clipboard-text-multiple',
    title: '学生贫困资助',
    itemShow: false
  },
  children: [
    {
      path: '/poverty/import',
      name: 'poverty-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-import',
        title: '贫困信息录入',
        itemShow: true
      }
    },
    {
      path: '/poverty/list',
      name: 'poverty-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '贫困信息统计',
        itemShow: true
      }
    },
    {
      path: '/poverty/manage',
      name: 'poverty-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '贫困信息管理',
        itemShow: true
      }
    }
  ]
}
