import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'

export interface Student {
  studentId: string
  idNumber: string
  name: string
  gender: string
  nativePlace: string
  postalCode: string
  phone: string
  nation: string
  majorName: string
  majorId: string
  grade: string
  classNo: string
  politicsStatus: string
  enabled: boolean
}

export async function apiAddStudentBaseInfo(
  students: Student[]
): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student/adds', { students })
}

export function apiGetStudentList(query: {
  search: string
  majorId: string | null
  grade: string | null
  pageNo: number
  pageSize: number
  enabled: boolean
}): Promise<AxiosResponse<Result<RecordsPage<Student>>>> {
  return http.post('/student/gets', query)
}

export function apiDeleteStudent(studentId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/student/delete/${studentId}`)
}

export function apiUpdateStudent(info: Student): Promise<AxiosResponse<Result<null>>> {
  return http.put('/student/update', info)
}

export function apiRecoverDeleteStudent(studentId: string): Promise<AxiosResponse<Result<null>>> {
  return http.put(`/student/recovery/${studentId}`)
}
