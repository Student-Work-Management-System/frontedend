import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'

export interface Enrollment {
  enrollmentId: string
  examineeId: string
  id: string
  name: string
  origin: string
  enrollSchool: string
  enrollMajor: string
  firstMajor: string
  score: string
}

export function apiAddEnrollment(enrollmentList: Enrollment[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/enrollment/adds', { enrollmentList })
}

export function apiGetEnrollment(query: {
  origin: string
  enrollSchool: string
  enrollMajor: string
  firstMajor: string
  pageNo: number
  pageSize: number
}): Promise<Result<RecordsPage<Enrollment[]>>> {
  return http.post('/enrollment/gets', query)
}

export function apiUpdateEnrollment(enroll: Enrollment): Promise<Result<null>> {
  return http.put('/enrollment/update', enroll)
}

export function apiDeleteEnrollment(enrollId: string): Promise<Result<null>> {
  return http.delete(`/enrollment/delete/${enrollId}`)
}
