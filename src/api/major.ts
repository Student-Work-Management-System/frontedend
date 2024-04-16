import http from '.'
import { type Result } from '.'
import { type AxiosResponse } from 'axios'

export interface Major {
  majorId: string
  majorName: string
}

export async function apiGetMajorList(): Promise<AxiosResponse<Result<Major[]>>> {
  return http.get('/major/gets')
}

export async function apiAddMajor(major: Major): Promise<AxiosResponse<Result<null>>> {
  return http.post('/major/add', major)
}

export async function apiDeleteMajor(majorId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/major/delete/${majorId}`)
}

export async function apiUpdateMajor(major: Major): Promise<AxiosResponse<Result<null>>> {
  return http.put('/major/update', major)
}
