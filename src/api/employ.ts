import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'

export interface Major {
  majorId: string
  majorName: string
}

export interface Employ {
  studentId: string
  studentEmploymentId: string
  grade: string
  graduationState: string
  graduationYear: string
  whereabouts: string
  jobNature: string
  jobIndustry: string
  jobLocation: string
  category: string
  salary: string
}


export function apiAddEmployInfo(employs: Employ[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/employment/adds', { insertStudentEmploymentDTOList: employs })
}

export function apiGetEmployList(query: {
  search: string
  majorId: string | null
  grade: string | null
  graduationYear: string | null
  pageNo: number
  pageSize: number
}): Promise<AxiosResponse<Result<RecordsPage<Employ>>>> {
  return http.post('/employment/gets', query)
}

export function apiUpdateEmploy(employ: Employ): Promise<AxiosResponse<Result<null>>> {
  return http.put('/employment/update', employ)
}

export function apiDeleteEmploy(employId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/employment/delete/${employId}`,)
}

export interface EmployStats {
  graduationStatus: any
  jobIndustry: any
  jobLocation: any
  salary: string
}

export function apiStatsEmploy(query: {
  graduationYears: string[] | null
  majorIds: string[] | null
}): Promise<AxiosResponse<Result<{ [key: string]: EmployStats }>>> {
  return http.post('/employment/stat', query)
}

export function apiDownloadStatsEmploy(query: {
  graduationYears: string[]
  majorIds: string[]
}): Promise<AxiosResponse<Blob>> {
  return http.post('/employment/download', query, { responseType: 'blob' })
}
