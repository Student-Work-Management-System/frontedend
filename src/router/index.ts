import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

import base from './base'
import cadre from './cadre'
import employment from './employment'
import poverty from './poverty'
import scholarship from './scholarship'
import competition from './competition'
import academic from './academic'
import punishment from './punishment'
import foreign from './foreign'
import precaution from './precaution'
import status from './status'
import system from './system'
import enrollment from './enrollment'

export const routes: RouteRecordRaw[] = [
  base,
  cadre,
  employment,
  poverty,
  scholarship,
  competition,
  academic,
  punishment,
  foreign,
  precaution,
  enrollment,
  status,
  system
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页',
        hasPage: false,
        auth: null
      },
      children: routes
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        auth: null
      }
    }
  ]
})

router.beforeEach(async (to) => {
  const userData = useUserStore().getUserData
  // 检查用户是否已登录
  if (userData.uid === '') {
    if (to.name === 'login') return // ❗️ 避免无限重定向
    return { name: 'login' }
  }

  // 已登录，不允许直接访问登录页面
  if (userData.uid !== '' && to.name === 'login') return { name: 'home' }

  // 检测用户是否用对应的页面权限
  if (
    to.meta !== undefined &&
    to.meta.auth !== undefined &&
    to.meta.auth !== null &&
    !userData.authorities?.map((a) => a.authority).includes(to.meta.auth as string)
  )
    return { name: 'home' }
})

export default router
