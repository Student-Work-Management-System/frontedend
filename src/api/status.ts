import http from '.'
import { type Result, type RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import { type Status, type StudentStatus } from "@/model/statusModel"
import type { StudentStatusItem, StudentStatusQuery } from '@/model/statusModel';

export async function apiGetAllStatus(): Promise<AxiosResponse<Result<Status[]>>> {
    return http.get('/status/gets');
}

export async function apiAddStatus(status: Status): Promise<AxiosResponse<Result<void>>> {
    return http.post("/status/add", status)
}

export async function apiUpdateStatus(status: Status): Promise<AxiosResponse<Result<void>>> {
    return http.put("/status/update", status)
}

export async function apiDeleteStatus(statusId: string): Promise<AxiosResponse<Result<void>>> {
    return http.delete(`/status/delete/${statusId}`)
}

export async function apiAddStudentStatus(studentStatus: StudentStatus): Promise<AxiosResponse<Result<void>>> {
    return http.post("/status/student/add", studentStatus)
}

export async function apiAddStudentStatusBatch(studentStatusList: StudentStatus[]): Promise<AxiosResponse<Result<void>>> {
    return http.post("/status/student/adds", studentStatusList)
}

export async function apiGetStudentStatusList(query: StudentStatusQuery): Promise<AxiosResponse<Result<RecordsPage<StudentStatusItem>>>> {
    return http.post("/status/student/gets", query)
}

export async function apiUpdateStudentStatus(studentStatus: StudentStatus): Promise<AxiosResponse<Result<void>>> {
    return http.put("/status/student/update", studentStatus)
}

export async function apiGetStudentStatusDetail(studentId: string): Promise<AxiosResponse<Result<StudentStatusItem[]>>> {
    return http.get(`/status/student/detail/${studentId}`)
}