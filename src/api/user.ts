import http from '.'
import { type Result } from '.'
import { type AxiosResponse } from 'axios'

export interface Authority {
  authority: string
  permissionDesc: string
}

export interface UserData {
  uid: string
  username: string
  realName: string
  phone: string
  authorities: Authority[] | null
  token: string
}

export function userDataCheck(obj: Object): UserData {
  const ud = obj as UserData
  if (
    ud.uid === undefined ||
    ud.username === undefined ||
    ud.realName === undefined ||
    ud.phone === undefined ||
    ud.authorities === undefined ||
    ud.token == undefined
  ) {
    console.error(ud)
    throw new Error('非法的数据')
  }
  return ud
}

export async function apiLogin(
  username: string,
  password: string
): Promise<AxiosResponse<Result<UserData>>> {
  return http.post('/user/login', { username, password })
}

export async function apiLogout(): Promise<AxiosResponse<Result<String>>> {
  return http.delete('/user/logout')
}
