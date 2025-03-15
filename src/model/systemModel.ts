import type { Grade, Degree } from './otherModel'
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
    authorities: Authority[] | null
    chargeGrades: Grade[] | null
    chargeDegrees: Degree[] | null
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
    roles: Role[]
    enabled: boolean
}


export interface Role {
    rid: string
    roleName: string
    roleDesc: string
    permissionList: Permission[]
}

export interface Permission {
    pid: string
    permissionName: string
    permissionDesc: string
}