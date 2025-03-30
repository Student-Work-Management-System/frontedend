import http from '.'
import { type Result } from '.'
import { type AxiosResponse } from 'axios'
import { type Status } from "@/model/statusModel"

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