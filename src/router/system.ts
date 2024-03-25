export default {
  path: '/system',
  name: 'system',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-cogs',
    itemShow: false,
    title: '系统管理'
  },
  children: [
    {
      path: '/system/user/manage',
      name: 'user-manage',
      component: () => import('@/views/home/system/UserManage.vue'),
      meta: {
        icon: 'mdi-account-cog',
        title: '用户账号管理',
        itemShow: true
      }
    },
    {
      path: '/system/user/role/manage',
      name: 'user-role-manage',
      component: () => import('@/views/home/system/RoleManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '角色权限管理',
        itemShow: true
      }
    }
  ]
}
