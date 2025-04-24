export default {
    path: "/leave",
    name: "/leave",
    component: () => import("@/components/basic/RouterContainer.vue"),
    meta: {
        icon: 'mdi-calendar-clock',
        title: '学生请假',
        hasPage: false,
        auth: 'student_leave:select'
    },
    children: [
        {
            path: '/leave/student',
            name: 'leave-student',
            component: () => import('@/views/home/leave/ApplyForLeave.vue'),
            meta: {
                icon: 'mdi-cloud-upload',
                title: '请假申请与记录查询',
                hasPage: true,
                auth: 'student_leave:select:student'
            }
        },
        {
            path: '/leave/review',
            name: 'leave-review',
            component: () => import('@/views/home/leave/StudentLeaveAudit.vue'),
            meta: {
                icon: 'mdi-eye-settings-outline',
                title: '学生请假审核与记录',
                hasPage: true,
                auth: 'student_leave_audit:select'
            }
        },
        {
            path: '/leave/stat',
            name: 'leave-stat',
            component: () => import('@/views/home/leave/StudentLeaveStat.vue'),
            meta: {
                icon: 'mdi-chart-bar',
                title: '请假信息统计',
                hasPage: true,
                auth: 'student_leave_audit:select'
            }
        }
    ]
}