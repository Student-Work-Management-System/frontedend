import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type UserData } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const user = reactive<UserData>({
    uid: '',
    username: '',
    realName: '',
    phone: '',
    authorities: null,
    token: ''
  })
  const getUserData = user
  function updateUser(newUser: UserData) {
    user.uid = newUser.uid
    user.username = newUser.username
    user.realName = newUser.realName
    user.phone = newUser.phone
    user.token = newUser.token
    user.authorities = newUser.authorities
  }

  return { user, getUserData, updateUser }
})
