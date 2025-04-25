import http from '.'
import type { AxiosResponse } from 'axios'
import type { Result, RecordsPage } from '.'
import type { StudentLeaveRequest, StudentLeaveItem, AuditLeaveQuery, AuditOperator, StudentLeaveQuery } from '@/model/leaveModel'

export const leaveTypes = ["事假", "病假"]
export const auditStates = ["审核中", "通过", "拒绝"]

export async function apiAddStudentLeave(request: StudentLeaveRequest): Promise<AxiosResponse<Result<null>>> {
    return http.post('/leave/student/add', request)
}

export async function apiGetOwnStudentLeave(query: StudentLeaveQuery): Promise<AxiosResponse<Result<RecordsPage<StudentLeaveItem>>>> {
    return http.post('/leave/student', query)
}

export async function apiGetAuditRecord(query: AuditLeaveQuery): Promise<AxiosResponse<Result<RecordsPage<StudentLeaveItem>>>> {
    return http.post('/leave/gets', query)
}

export async function apiDestroyStudentLeave(leaveId: string): Promise<AxiosResponse<Result<StudentLeaveItem>>> {
    return http.put(`/leave/student/destroy/${leaveId}`)
}

export async function apiRevokedStudentLeave(auditId: string): Promise<AxiosResponse<Result<string>>> {
    return http.put(`/leave/student/revoked/${auditId}`)
}

export async function apiCounselorAudit(operator: AuditOperator): Promise<AxiosResponse<Result<null>>> {
    return http.put('/leave/counselor/audit', operator)
}

export async function apiLeaderAudit(operator: AuditOperator): Promise<AxiosResponse<Result<null>>> {
    return http.put('/leave/leader/audit', operator)
}
