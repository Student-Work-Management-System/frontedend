export default {
  path: '/employment',
  name: 'employment',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-briefcase',
    title: '学生就业统计',
    itemShow: false
  },
  children: [
    {
      path: '/employment/import',
      name: 'employment-import',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-upload-outline',
        title: '就业信息录入',
        itemShow: true
      }
    },
    {
      path: '/base/list',
      name: 'employment-list',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-chart-bell-curve',
        title: '就业信息统计',
        itemShow: true
      }
    },
    {
      path: '/base/manage',
      name: 'employment-manage',
      component: () => import('@/views/home/base/BaseInfoManage.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '就业信息管理',
        itemShow: true
      }
    }
  ]
}
