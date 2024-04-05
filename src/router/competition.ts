export default {
  path: '/competition',
  name: 'competition',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-horse-variant',
    title: '学科竞赛记录',
    hasPage: false,
    auth: null
  },
  children: [
    {
      path: '/competition/import',
      name: 'competition-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-cloud-upload',
        title: '学生获奖上报',
        hasPage: true,
        auth: 'student_competition:insert'
      }
    },
    {
      path: '/competition/review',
      name: 'competition-review',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-eye-settings-outline',
        title: '上报情况审核',
        hasPage: true,
        auth: 'student_competition_claim:update'
      }
    },
    {
      path: '/competition/list',
      name: 'competition-list',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '获奖情况统计',
        hasPage: true,
        auth: 'student_competition_claim:select'
      }
    },
    {
      path: '/competition/manage',
      name: 'competition-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '竞赛类别管理',
        hasPage: true,
        auth: 'competition:update'
      }
    }
  ]
}
