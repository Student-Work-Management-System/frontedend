export default {
  path: '/academic',
  name: 'academic',
  component: () => import('@/components/basic/RouterContainer.vue'),
  meta: {
    icon: 'mdi-book-open',
    title: '学生学术成果',
    hasPage: false,
    auth: 'student_academic_work:select'
  },
  children: [
    {
      path: '/academic/import',
      name: 'academic-import',
      component: () => import('@/views/home/academicWork/AcademicWorkUpload.vue'),
      meta: {
        icon: 'mdi-cloud-upload',
        title: '学生成果上报',
        hasPage: true,
        auth: 'student_academic_work:insert'
      }
    },
    {
      path: '/academic/review',
      name: 'academic-review',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-eye-settings-outline',
        title: '上报情况审核',
        hasPage: true,
        auth: 'student_academic_work_audit:update'
      }
    },
    {
      path: '/academic/list',
      name: 'academic-list',
      component: () => import('@/views/home/base/BaseInfoImport.vue'),
      meta: {
        icon: 'mdi-chart-bar',
        title: '学术成果统计',
        hasPage: true,
        auth: 'student_academic_work_audit:select'
      }
    },
    {
      path: '/academic/manage',
      name: 'academic-manage',
      component: () => import('@/views/home/base/tab/BaseInfoData.vue'),
      meta: {
        icon: 'mdi-cog',
        title: '学术成果管理',
        hasPage: true,
        auth: 'student_academic_work_audit:update'
      }
    }
  ]
}
