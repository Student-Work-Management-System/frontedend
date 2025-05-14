import type { AcademicWorkQuery, AcademicWorkRequest, AcademicWorkAudit, AcademicWorkItem, AcademicWorkUser, AcademicWorkStatGroup } from "@/model/academicWorkModel";
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

export async function apiGetOwn(Id: string): Promise<AxiosResponse<Result<AcademicWorkItem[]>>> {
    return http.get(`/academicWork/get/${Id}`)
}

export async function apiGetAllAcademicWork(query: AcademicWorkQuery): Promise<AxiosResponse<Result<RecordsPage<AcademicWorkItem>>>> {
    return http.post('/academicWork/gets', query)
}

export async function apiAddAcademicWork(request: AcademicWorkRequest): Promise<AxiosResponse<Result<void>>> {
    return http.post('/academicWork/add', request)
}

export async function apiUpdateAcademicWorkAudit(audits: AcademicWorkAudit[]): Promise<AxiosResponse<Result<void>>> {
    return http.put('/academicWork/update', audits)
}

export async function apiDeleteAcademicWork(AcademicWorkId: string): Promise<AxiosResponse<Result<void>>> {
    return http.delete(`/academicWork/delete/${AcademicWorkId}`)
}

export async function apiGetOptionalUser(username: string): Promise<AxiosResponse<Result<AcademicWorkUser[]>>> {
    return http.get(`/academicWork/user/${username}`)
}

export async function apiGetStat(): Promise<AxiosResponse<Result<AcademicWorkStatGroup>>> {
    return http.get("/academicWork/stat")
}