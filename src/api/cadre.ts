import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { Cadre, StudentCadre, StudentCadreItem, CadreQuery, CadreStatusQuery, StudentCadreStatusItem } from '@/model/cadreModel'

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

export async function apiAddCadre(cadre: Cadre): Promise<AxiosResponse<Result<null>>> {
  return http.post('/cadre/add', cadre)
}

export async function apiAddStudentCadre(studentCadre: StudentCadre): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student_cadre/add', studentCadre)
}

export async function apiAddStudentCadres(studentCadres: StudentCadre[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student_cadre/adds', studentCadres)
}

export async function apiUpdateCadre(cadre: Cadre) {
  return http.put('/cadre/update', cadre)
}

export async function apiUpdateStudentCadre(studentCadre: StudentCadre) {
  return http.put('/student_cadre/update', studentCadre)
}

export async function apiDeleteCadre(cadreId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/cadre/delete/${cadreId}`)
}

export async function apiDeleteStudentCadre(studentCadreId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/student_cadre/delete/${studentCadreId}`)
}

export async function apiGetCadreStatus(query: CadreStatusQuery): Promise<AxiosResponse<Result<StudentCadreStatusItem[]>>> {
  return http.post('/student_cadre/status', query)
}

