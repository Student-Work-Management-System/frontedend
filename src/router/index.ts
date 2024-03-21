import { createRouter, createWebHashHistory } from 'vue-router'
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

export default router
