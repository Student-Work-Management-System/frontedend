export default {
  path: '/cadre',
  name: 'cadre',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-account-tie',
    title: '学生干部信息',
    hasPage: false,
    auth: 'cadre:select'
  },
  children: [
    {
      path: '/cadre/import',
      name: 'cadre-import',
      component: () => import('@/views/home/cadre/StudentCadreInfoImpot.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '职位信息录入',
        hasPage: true,
        auth: 'cadre:insert'
      }
    },
    {
      path: '/cadre/list',
      name: 'cadre-list',
      component: () => import('@/views/home/cadre/StudentCadreList.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '职位信息统计',
        hasPage: true,
        auth: 'student_cadre:select'
      }
    },
    {
      path: '/cadre/manage',
      name: 'cadre-manage',
      component: () => import('@/views/home/cadre/CadreManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '职位管理',
        hasPage: true,
        auth: 'cadre:update'
      }
    }
  ]
}
