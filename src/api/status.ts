import http from '.'
import { type Result } from '.'
import { type AxiosResponse } from 'axios'

export interface Status {
    statusId: string
    statusName: string
}

export interface StudentStatus {
    studentStatusId: string,
    studentId: string,
    statusId: string,
    handle: string,
    changedDate: Date
}

export async function apiGetAllStatus(): Promise<AxiosResponse<Result<Status[]>>> {
    return http.get('/status/allStatus');
}