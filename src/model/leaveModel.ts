import type { AuditState } from "./index"

export interface LeaveQuery {
    search: string
    gradeId: string | null
    majorId: string | null
    totalDay: string | null
    counselorHandleState: string | null
    leaderHandleState: string | null
    destroyed: boolean | null
    revoked: boolean | null
    pageNo: number
    pageSize: number
}

export interface AuditOperator {
    auditId: string
    username: string
    state: AuditState
    needNoticeStudent: boolean
    needNoticeLeader: boolean
}

export interface StudentLeaveRequest {
    studentId: string
    type: string
    reason: string
    target: string
    targetDetail: string
    internship: boolean
    startDay: string
    endDay: string
    evidences: string[]
    counselorId: string
}

export interface StudentLeave {
    leaveId: string
    studentId: string
    type: string
    reason: string
    target: string
    targetDetail: string
    internship: boolean
    startDay: string
    endDay: string
    destroyed: boolean
}

export interface StudentLeaveAudit {
    auditId: string
    leaveId: string
    counselorId: string
    counselorHandleTime: string
    counselorHandleState: AuditState
    leaderId: string
    leaderHandleTime: string
    leaderHandleState: AuditState
    revoked: boolean
}

export interface StudentLeaveEvidence {
    evidenceId: string
    leaveId: string
    path: string
}

export interface StudentLeaveItem {
    leaveId: string
    studentId: string
    name: string
    gradeName: string
    majorName: string
    type: string
    reason: string
    target: string
    targetDetail: string
    internship: boolean
    startDay: string
    endDay: string
    destroyed: boolean
    auditId: string
    counselorId: string
    counselorHandleTime: string
    counselorHandleState: AuditState
    leaderId: string
    leaderHandleTime: string
    leaderHandleState: AuditState
    revoked: boolean
    evidences: string[]
}
