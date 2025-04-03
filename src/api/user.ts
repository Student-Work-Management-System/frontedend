import http from '.'
import type { Result } from '.'
import { type AxiosResponse } from 'axios'
import type { UserData, UserRecord, User, RoleItem, UserRoleRequest } from '@/model/systemModel'

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

export async function apiGetUserList(query: {
  keyword?: string
  enabled: boolean | null
  pageNo: number
  pageSize: number
}): Promise<AxiosResponse<Result<UserRecord[]>>> {
  return http.post('/user/gets', query)
}

export async function apiAddUser(user: User): Promise<AxiosResponse<Result<null>>> {
  return http.post('/user/add', user)
}

export async function apiGetUserRoles(uid: string): Promise<AxiosResponse<Result<RoleItem[]>>> {
  return http.get(`/user/role/${uid}`)
}

export async function apiUpdateUserRole(userRole: UserRoleRequest): Promise<AxiosResponse<Result<null>>> {
  return http.put('/user/update/role', userRole)
}

export async function apiDeleteUser(uid: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/user/delete/${uid}`)
}

export async function apiUpdateUserInfo(userInfo: {
  uid: string
  realName: string
  email: string
  phone: string
  password: string | null
}): Promise<AxiosResponse<Result<null>>> {
  return http.put('/user/update', userInfo)
}

export async function apiFindBackPassword(username: string): Promise<AxiosResponse<Result<{ email: string }>>> {
  return http.get(`/user/findBackPassword/${username}`)
}

export async function apiUpdatePassword(body: {
  username: string
  password: string
  code: string
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/user/updatePassword', body)
}

export async function apiRecoverDeteteUser(userId: string): Promise<AxiosResponse<Result<null>>> {
  return http.put(`/user/recovery/${userId}`)
}
