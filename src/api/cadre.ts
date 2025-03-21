import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { Cadre, StudentCadre, StudentCadreItem, CadreQuery } from '@/model/cadreModel'

// 职位等级
export function getCadreLevers(): string[] {
  return ['校级', '院级', '班级']
}

export async function apiGetCadreList(): Promise<AxiosResponse<Result<Cadre[]>>> {
  return http.get('/cadre/gets')
}
export async function apiGetStudentCadreList(query: CadreQuery): Promise<AxiosResponse<Result<RecordsPage<StudentCadreItem>>>> {
  return http.post('/student_cadre/gets', query)
}

export async function apiAddCadre(cadre: {
  cadrePosition: string
  cadreLevel: string
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/cadre/add', cadre)
}
export async function apiAddCadreInfo(
  cadres: Cadre[]
): Promise<AxiosResponse<Result<null>>> {
  return http.post('/cadre/adds', { cadres })
}

export async function apiAddStudentCadre(studentCadre: {
  studentId: string
  cadreId: string
  appointmentStartTerm: string
  appointmentEndTerm: string
  comment: string
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student_cadre/add', studentCadre)
}

export async function apiAddStudentCadreInfo(
  insertStudentCadreDTOList: StudentCadre[]
): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student_cadre/adds', { insertStudentCadreDTOList })
}

export async function apiUpdateCadreInfo(cadreInfo: {
  cadreId: string
  cadrePosition: string
  cadreLevel: string
}) {
  return http.put('/cadre/update', cadreInfo)
}
export async function apiUpdateStudentCadreInfo(studentCadreInfo: StudentCadre) {
  return http.put('/student_cadre/update', studentCadreInfo)
}
export async function apiDeleteCadre(cadreId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/cadre/delete/${cadreId}`)
}

export async function apiDeleteStudentCadre(studentCadreId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/student_cadre/delete/${studentCadreId}`)
}
