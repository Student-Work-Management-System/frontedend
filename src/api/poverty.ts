import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { PovertyAssistance, PovertyAssistanceQuery, PovertyAssistanceStatGroup, PovertyAssistanceStatQuery, StudentPovertyAssistance, StudentPovertyAssistanceItem } from '@/model/povertyModel'

// 贫困等级
export function getPovertyLevels(): string[] {
  return ['特别困难', '比较困难', '一般困难']
}

export async function apiAddPovertyAssistance(povertyAssistance: PovertyAssistance): Promise<AxiosResponse<Result<null>>> {
  return http.post('/povertyAssistance/add', povertyAssistance)
}

export async function apiAddPovertyAssistances(povertyAssistances: PovertyAssistance[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/povertyAssistance/adds', povertyAssistances)
}

export async function apiDeletePovertyAssistance(povertyAssistanceId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/povertyAssistance/delete/${povertyAssistanceId}`)
}

export async function apiUpdatePovertyAssistance(povertyAssistance: PovertyAssistance) {
  return http.put('/povertyAssistance/update', povertyAssistance)
}

export async function apiGetPovertyAssistanceList(): Promise<AxiosResponse<Result<PovertyAssistance[]>>> {
  return http.get('/povertyAssistance/gets')
}

export async function apiAddStudentPovertyAssistance(studentPovertyAssistance: StudentPovertyAssistance): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student/povertyAssistance/add', studentPovertyAssistance)
}

export async function apiDeleteStudentPovertyAssistance(studentPovertyAssistanceId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/student/povertyAssistance/delete/${studentPovertyAssistanceId}`)
}

export async function apiUpdateStudentPovertyAssistance(studentPovertyAssistance: StudentPovertyAssistance) {
  return http.put('/student/povertyAssistance/update', studentPovertyAssistance)
}

export async function apiGetStudentPovertyAssistanceList(query: PovertyAssistanceQuery): Promise<AxiosResponse<Result<RecordsPage<StudentPovertyAssistanceItem>>>> {
  return http.post('/student/povertyAssistance/gets', query)
}

export async function apiAddStudentPovertyAssistanceInfo(studentPovertyAssistances: StudentPovertyAssistance[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student/povertyAssistance/adds', studentPovertyAssistances)
}

export async function apiGetStudentPovertyAssistanceStat(studentPovertyAssistances: PovertyAssistanceStatQuery): Promise<AxiosResponse<Result<PovertyAssistanceStatGroup[]>>> {
  return http.post('/student/povertyAssistance/stat', studentPovertyAssistances)
}
