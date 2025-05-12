import type { AcademicWorkQuery, AcademicWorkRequest, StudentAcademicWorkAudit, StudentAcademicWorkItem, AcademicWorkUser, AcademicWorkStatGroup } from "@/model/academicWorkModel";
import http from ".";
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'

export const academicWorkStates = ["审核中", "通过", "拒绝"]
export const academicWorkTypes = [
    {
        key: '论文',
        val: 'paper'
    },
    {
        key: "软著",
        val: "soft"
    },
    {
        key: "专利",
        val: "patent"
    }
]

export async function apiGetStudentOwn(studentId: string): Promise<AxiosResponse<Result<StudentAcademicWorkItem[]>>> {
    return http.get(`/academicWork/get/${studentId}`)
}

export async function apiGetAllStudentAcademicWork(query: AcademicWorkQuery): Promise<AxiosResponse<Result<RecordsPage<StudentAcademicWorkItem>>>> {
    return http.post('/academicWork/gets', query)
}

export async function apiAddStudentAcademicWork(request: AcademicWorkRequest): Promise<AxiosResponse<Result<void>>> {
    return http.post('/academicWork/add', request)
}

export async function apiUpdateStudentAcademicWorkAudit(audits: StudentAcademicWorkAudit[]): Promise<AxiosResponse<Result<void>>> {
    return http.put('/academicWork/update', audits)
}

export async function apiDeleteStudentAcademicWork(studentAcademicWorkId: string): Promise<AxiosResponse<Result<void>>> {
    return http.delete(`/academicWork/delete/${studentAcademicWorkId}`)
}

export async function apiGetOptionalUser(username: string): Promise<AxiosResponse<Result<AcademicWorkUser[]>>> {
    return http.get(`/academicWork/user/${username}`)
}

export async function apiGetStat(): Promise<AxiosResponse<Result<AcademicWorkStatGroup>>> {
    return http.get("/academicWork/stat")
}