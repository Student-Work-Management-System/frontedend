import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type UserData } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const user = reactive<UserData>({ user: null, authorities: null, token: '' })
  const getUserData = user
  function updateUser(newUser: UserData) {
    user.user = newUser.user
    user.token = newUser.token
    user.authorities = newUser.authorities
  }

  return { user, getUserData, updateUser }
})
