export default {
  path: '/competition',
  name: 'competition',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-horse-variant',
    title: '学科竞赛记录',
    itemShow: false
  },
  children: [
    {
      path: '/competition/import',
      name: 'competition-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-cloud-upload',
        title: '学生获奖上报',
        itemShow: true
      }
    },
    {
      path: '/competition/review',
      name: 'competition-review',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-eye-settings-outline',
        title: '上报情况审核',
        itemShow: true
      }
    },
    {
      path: '/competition/list',
      name: 'competition-list',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-chart-bell-curve',
        title: '获奖情况统计',
        itemShow: true
      }
    },
    {
      path: '/competition/manage',
      name: 'competition-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '竞赛类别管理',
        itemShow: true
      }
    }
  ]
}
