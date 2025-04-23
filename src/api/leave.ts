import http from '.'
import type { AxiosResponse } from 'axios'
import type { Result, RecordsPage, BaseQuery } from '.'
import type { StudentLeaveRequest, StudentLeaveItem, LeaveQuery, AuditOperator } from '@/model/leaveModel'

export async function apiAddStudentLeave(request: StudentLeaveRequest): Promise<AxiosResponse<Result<null>>> {
    return http.post('/leave/student/add', request)
}

export async function apiGetOwnStudentLeave(query: BaseQuery): Promise<AxiosResponse<Result<RecordsPage<StudentLeaveItem>>>> {
    return http.post('/leave/student', query)
}

export async function apiGetAuditRecord(query: LeaveQuery): Promise<AxiosResponse<Result<RecordsPage<StudentLeaveItem>>>> {
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
