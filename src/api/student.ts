import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { Student, StudentQuery, StudentStatItem, StudentStatQuery, HeaderTeacher, StudentBasicItem } from '@/model/studentModel'

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

export function apiGetStudentStat(query: StudentStatQuery): Promise<AxiosResponse<Result<StudentStatItem[]>>> {
  return http.post('/student/stat', { degreeId: query.degreeId, gradeId: query.gradeId })
}

export function apiGetHeaderTeahcers(): Promise<AxiosResponse<Result<HeaderTeacher[]>>> {
  return http.get('/student/gets/headerTeacher')
}

export function apiGetStudentBasic(studentId: string): Promise<AxiosResponse<Result<StudentBasicItem[]>>> {
  return http.get(`/student/basic/get/${studentId}`)
}

export function apiGetStudentBasicList(studentIds: string[]): Promise<AxiosResponse<Result<StudentBasicItem[]>>> {
  return http.post('/student/basic/gets', studentIds)
}
