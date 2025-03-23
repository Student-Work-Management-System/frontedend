import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { PovertyAssistance, PovertyAssistanceQuery, StudentPovertyAssistance, StudentPovertyAssistanceRecord } from '@/model/povertyModel'

// 贫困等级
export function getPovertyLevels(): string[] {
  return ['特别困难', '比较困难', '一般困难']
}

export async function apiAddPovertyAssistance(povertyAssistance: PovertyAssistance): Promise<AxiosResponse<Result<null>>> {
  return http.post('/poverty_assistance/add', povertyAssistance)
}

export async function apiAddPovertyAssistances(povertyAssistances: PovertyAssistance[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/poverty_assistance/adds', povertyAssistances)
}

export async function apiDeletePovertyAssistance(povertyAssistanceId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/poverty_assistance/delete/${povertyAssistanceId}`)
}

export async function apiUpdatePovertyAssistance(povertyAssistance: PovertyAssistance) {
  return http.put('/poverty_assistance/update', povertyAssistance)
}

export async function apiGetPovertyAssistanceList(): Promise<AxiosResponse<Result<PovertyAssistance[]>>> {
  return http.get('/poverty_assistance/gets')
}

export async function apiAddStudentPovertyAssistance(studentPovertyAssistance: StudentPovertyAssistance): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student_poverty_assistance/add', studentPovertyAssistance)
}

export async function apiDeleteStudentPovertyAssistance(studentPovertyAssistanceId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/student_poverty_assistance/delete/${studentPovertyAssistanceId}`)
}

export async function apiUpdateStudentPovertyAssistance(studentPovertyAssistance: StudentPovertyAssistance) {
  return http.put('/student_poverty_assistance/update', studentPovertyAssistance)
}

export async function apiGetStudentPovertyAssistanceList(query: PovertyAssistanceQuery): Promise<AxiosResponse<Result<RecordsPage<StudentPovertyAssistanceRecord>>>> {
  return http.post('/student_poverty_assistance/gets', query)
}

export async function apiAddStudentPovertyAssistanceInfo(studentPovertyAssistances: StudentPovertyAssistance[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student_poverty_assistance/adds', studentPovertyAssistances)
}
