export default {
  path: '/system',
  name: 'system',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-cogs',
    hasPage: false,
    title: '系统管理',
    auth: 'permission:select'
  },
  children: [
    {
      path: "/system/school/manage",
      name: "school-manage",
      component: () => import("@/views/home/system/SchoolManageTab.vue"),
      meta: {
        icon: 'mdi-book-cog',
        title: '学院信息管理',
        hasPage: true,
        auth: 'counselor:update'
      }
    },
    {
      path: '/system/user/manage',
      name: 'user-manage',
      component: () => import('@/views/home/system/UserManage.vue'),
      meta: {
        icon: 'mdi-account-cog',
        title: '用户账号管理',
        hasPage: true,
        auth: 'user:update:all'
      }
    },
    {
      path: '/system/user/role/manage',
      name: 'user-role-manage',
      component: () => import('@/views/home/system/RoleManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '角色权限管理',
        hasPage: true,
        auth: 'role_permission:select'
      }
    }
  ]
}
