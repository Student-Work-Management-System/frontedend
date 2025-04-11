import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type UserData } from '@/model/systemModel'

export const useUserStore = defineStore('user', () => {
  const user = reactive<UserData>({
    uid: '',
    username: '',
    realName: '',
    email: '',
    isStudent: true,
    authorities: null,
    token: '',
    chargeGrades: null
  })

  const getUserData = user
  function updateUser(newUser: UserData) {
    user.uid = newUser.uid
    user.username = newUser.username
    user.realName = newUser.realName
    user.email = newUser.email
    user.token = newUser.token
    user.authorities = newUser.authorities
    user.chargeGrades = newUser.chargeGrades
    user.isStudent = newUser.isStudent
  }

  function hasAuthorized(authority: string): boolean {
    return user.authorities!.some((a) => a.authority === authority)
  }

  function cleanStore() {
    updateUser({
      uid: '',
      username: '',
      realName: '',
      email: '',
      authorities: null,
      token: '',
      chargeGrades: null,
      isStudent: false
    })
  }
  return { user, getUserData, updateUser, hasAuthorized, cleanStore }
})
