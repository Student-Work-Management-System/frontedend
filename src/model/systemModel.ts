import type { Grade } from './otherModel'
export interface User {
    username: string
    realName: string
    email: string
    phone: string
    password: string
    roles: string[]
}

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
    isStudent: boolean
    authorities: Authority[] | null
    chargeGrades: Grade[] | null
    token: string
}

// 用户列表相关数据
export interface UserRecord {
    uid: string
    username: string
    realName: string
    email: string
    phone: string
    createdAt: string
    roles: RoleItem[]
    enabled: boolean
}

export interface UserRoleRequest {
    uid: string
    roles: string[]
}

export interface RoleItem {
    rid?: string
    roleName: string
    roleDesc: string
    permissionList: Permission[]
}

export interface Role {
    rid?: string
    roleName: string
    roleDesc: string
}

export interface Permission {
    pid: string
    permissionName: string
    permissionDesc: string
}