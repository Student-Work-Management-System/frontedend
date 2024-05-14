import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'

export interface Enrollment {
  enrollmentId: string
  examineeId: string
  id: string
  name: string
  origin: string
  enrollMajor: string
  enrollMajorId: string
  firstMajor: string
  score: string
  enrollTime: string
}

export function apiAddEnrollment(enrollments: Enrollment[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/enrollment/adds', { enrollments })
}

export async function apiGetEnrollment(query: {
  name: string | null
  enrollTime: string | null
  examineeId: string | null
  id: string | null
  origin: string | null
  enrollMajor: string | null
  enrollMajorId: string | null
  firstMajor: string | null
  pageNo: number
  pageSize: number
}): Promise<AxiosResponse<Result<RecordsPage<Enrollment>>>> {
  return http.post('/enrollment/gets', query)
}

export async function apiUpdateEnrollment(enroll: Enrollment): Promise<AxiosResponse<Result<null>>> {
  return http.put('/enrollment/update', enroll)
}

export async function apiDeleteEnrollment(enrollId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/enrollment/delete/${enrollId}`)
}

export interface EnrollStats {
  origin: any
  enrollmentState: any
  regionScores: any
}

export async function apiStatsEnroll(query: {
  enrollmentYears: string[] | null
  majorIds: string[] | null
}): Promise<AxiosResponse<Result<{ [key: string]: EnrollStats }>>> {
  return http.post('/enrollment/stat', query)
}

export async function apiDownloadStatsEnroll(query: {
  enrollmentYears: string[] | null
  majorIds: string[] | null
}): Promise<AxiosResponse<Blob>> {
  return http.post('/enrollment/download', query, { responseType: 'blob' })
}
