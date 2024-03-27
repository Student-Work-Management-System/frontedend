import http from '.'
import { type Result } from '.'
import { type AxiosResponse } from 'axios'

export interface Role {
  rid: string
  roleName: string
  roleDesc: string
  permissionList: PermissionList[]
}

export interface PermissionList {
  permissionName: string
  permissionDesc: string
}

export async function apiGetRoleList(): Promise<AxiosResponse<Result<Role[]>>> {
  return http.get('/auth/gets')
}
