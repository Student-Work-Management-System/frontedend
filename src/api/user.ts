import http from '.'
import { type Result } from '.'
import { type AxiosResponse } from 'axios'

export interface User {
  uid: string
  username: string
  realName: string
  phone: string
  password: string
  createdAt: string
}

export interface Authority {
  authority: string
  permissionDesc: string
}

export interface UserData {
  user: User | null
  authorities: Authority[] | null
  token: string
}

export function userDataCheck(obj: Object): UserData {
  const ud = obj as UserData
  if (ud.user === undefined || ud.token === undefined || ud.token == undefined)
    throw new Error('非法的数据')
  return ud
}

export async function apiLogin(
  username: string,
  password: string
): Promise<AxiosResponse<Result<UserData>>> {
  return http.post('/user/login', { username, password })
}
