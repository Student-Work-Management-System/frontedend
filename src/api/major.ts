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
