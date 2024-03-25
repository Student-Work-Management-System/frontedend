import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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
import cet from './cet'
import precaution from './precaution'
import status from './status'
import system from './system'
import enrollment from './enrollment'

export const routes = [
  base,
  cadre,
  employment,
  poverty,
  scholarship,
  competition,
  academic,
  punishment,
  cet,
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
        itemShow: false
      },
      children: routes
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

router.beforeEach(async (to) => {
  const store = useUserStore()
  // 检查用户是否已登录
  if (store.getUserData.uid === '') {
    if (to.name === 'login') return // ❗️ 避免无限重定向
    return { name: 'login' }
  }

  // 已登录，不允许直接访问登录页面
  if (store.getUserData.uid !== '' && to.name === 'login') return { name: 'home' }

  // 检测用户是否用对应的页面权限
  // store.getUserData.authorities?.find(() => {})
})

export default router
