import http from '.'
import { type Result } from '.'
import { type AxiosResponse } from 'axios'
import type { Role, Permission } from '@/model/systemModel'

export interface PermissionTree extends Permission {
  children: PermissionTree[]
}

export async function apiGetRoleList(): Promise<AxiosResponse<Result<Role[]>>> {
  return http.get('/auth/gets')
}

export async function apiGetPermissionTree(): Promise<AxiosResponse<Result<PermissionTree[]>>> {
  return http.get('/auth/permission/gets')
}

export async function apiAddRole(role: {
  roleName: string
  roleDesc: string
  permissions: Permission[]
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/auth/add/role', role)
}

export async function apiDeleteRole(rid: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/auth/delete/role/${rid}`)
}

export async function apiUpdateRolePermissions(rolePermission: {
  rid: string
  permissions: string[]
}): Promise<AxiosResponse<Result<null>>> {
  return http.put('/auth/update/role/permission', rolePermission)
}
