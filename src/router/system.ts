export default {
  path: '/system',
  name: 'system',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-clipboard-text-multiple',
    itemShow: false,
    title: '系统管理'
  },
  children: [
    {
      path: '/system/user/manage',
      name: 'user-manage',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-import',
        title: '用户账号管理',
        itemShow: true
      }
    },
    {
      path: '/system/user/role/manage',
      name: 'user-role-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '用户角色管理',
        itemShow: true
      }
    }
  ]
}
