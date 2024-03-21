export default {
  path: '/cet',
  name: 'cet',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-clipboard-text-multiple',
    title: 'CET等级成绩统计',
    itemShow: false
  },
  children: [
    {
      path: '/cet/import',
      name: 'cet-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-import',
        title: '考试成绩录入',
        itemShow: true
      }
    },
    {
      path: '/cet/list',
      name: 'cet-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-credit-card-edit',
        title: '考试成绩统计',
        itemShow: true
      }
    }
  ]
}
