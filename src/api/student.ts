import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import { type Student, type StudentQuery } from '@/model/studentModel'

export async function apiAddStudentBaseInfo(
  students: Student[]
): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student/adds', students)
}

export function apiGetStudentList(query: StudentQuery): Promise<AxiosResponse<Result<RecordsPage<Student>>>> {
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

export function apiValidateHeadTeacherExists(headTeacherUsername: string): Promise<AxiosResponse<Result<null>>> {
  return http.get(`/student/validate_teacher_existed/${headTeacherUsername}`)
}

export const apiGetStudentStatistics = (query: StudentQuery) => {
  return http.get('/student/status', { params: query })
}
