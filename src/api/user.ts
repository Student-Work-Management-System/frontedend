import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import { type Role } from './role'

export interface Authority {
  authority: string
  permissionDesc: string
}

// 与用户登录账户相关的数据
export interface UserData {
  uid: string
  username: string
  realName: string
  email: string
  authorities: Authority[] | null
  token: string
}

// 用户列表相关数据
export interface UserRecord {
  uid: string
  username: string
  realName: string
  email: string
  createdAt: string
  roles: Role[]
}

export function userDataCheck(obj: Object): UserData {
  const ud = obj as UserData
  if (
    ud.uid === undefined ||
    ud.username === undefined ||
    ud.realName === undefined ||
    ud.email === undefined ||
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

export async function apiLogout(): Promise<AxiosResponse<Result<null>>> {
  return http.delete('/user/logout')
}

export async function apiGetUserList(params: {
  keyword: string
  pageNo: number
  pageSize: number
}): Promise<AxiosResponse<Result<RecordsPage<UserRecord>>>> {
  return http.get('/user/gets', { params })
}

export async function apiAddUser(user: {
  username: string
  realName: string
  email: string
  password: string
  roles: string[]
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/user/add', user)
}

export async function apiUpdateUser(userRole: {
  uid: string
  roles: string[]
}): Promise<AxiosResponse<Result<null>>> {
  return http.put('/user/update/role', userRole)
}
