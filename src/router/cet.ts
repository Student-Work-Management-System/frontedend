export default {
  path: '/cet',
  name: 'cet',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-web',
    title: 'CET等级成绩统计',
    hasPage: false,
    auth: 'student_cet:select'
  },
  children: [
    {
      path: '/cet/import',
      name: 'cet-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-plus-box-multiple',
        title: '考试成绩录入',
        hasPage: true,
        auth: 'student_cet:insert'
      }
    },
    {
      path: '/cet/list',
      name: 'cet-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '考试成绩统计',
        hasPage: true,
        auth: 'student_cet:select'
      }
    }
  ]
}
