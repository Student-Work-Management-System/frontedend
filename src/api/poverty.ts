import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'

// 贫困资助记录
export interface PovertyAssistance {
  povertyAssistanceId: string
  povertyLevel: string
  povertyType: string
  povertyAssistanceStandard: string
}

// 学生贫困资助认定
export interface StudentPovertyAssistance {
  studentPovertyAssistanceId: string
  studentId: string
  povertyAssistanceId: string
  assistanceYear: string
}

// 学生贫困资助认定列表相关数据
export interface StudentPovertyAssistanceRecord {
  studentPovertyAssistanceId: string
  studentId: string
  povertyAssistanceId: string
  name: string
  majorName: string
  povertyLevel: string
  povertyType: string
  povertyAssistanceStandard: string
  assistanceYear: string
}

// 贫困等级
export function getPovertyLevels(): string[] {
  return ['特别困难', '比较困难', '一般困难']
}



export async function apiAddPovertyAssistance(povertyAssistance: {
  povertyLevel: string
  povertyType: string
  povertyAssistanceStandard: string
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/poverty_assistance/add', povertyAssistance)
}

export async function apiAddPovertyAssistanceInfo(
  povertyAssistances: PovertyAssistance[]
): Promise<AxiosResponse<Result<null>>> {
  return http.post('/poverty_assistance/adds', { povertyAssistances })
}

export async function apiDeletePovertyAssistance(
  povertyAssistanceId: string
): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/poverty_assistance/delete/${povertyAssistanceId}`)
}

export async function apiUpdatePovertyAssistance(povertyAssistanceInfo: {
  povertyLevel: string
  povertyType: string
  povertyAssistanceStandard: string
}) {
  return http.put('/poverty_assistance/update', povertyAssistanceInfo)
}

export async function apiGetPovertyAssistanceList(): Promise<
  AxiosResponse<Result<PovertyAssistance[]>>
> {
  return http.get('/poverty_assistance/gets')
}

export async function apiAddStudentPovertyAssistance(studentPovertyAssistance: {
  studentId: string
  povertyAssistanceId: string
  assistanceYear: string
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student_poverty_assistance/add', studentPovertyAssistance)
}

export async function apiDeleteStudentPovertyAssistance(
  studentPovertyAssistanceId: string
): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/student_poverty_assistance/delete/${studentPovertyAssistanceId}`)
}

export async function apiUpdateStudentPovertyAssistance(
  studentPovertyAssistanceInfo: StudentPovertyAssistance
) {
  return http.put('/student_poverty_assistance/update', studentPovertyAssistanceInfo)
}

export async function apiGetStudentPovertyAssistanceList(query: {
  search: string | null
  majorId: string | null
  grade: string | null
  povertyLevel: string | null
  assistanceYear: string | null
  pageNo: number
  pageSize: number
}): Promise<AxiosResponse<Result<RecordsPage<StudentPovertyAssistanceRecord>>>> {
  return http.post('/student_poverty_assistance/gets', query)
}

export async function apiAddStudentPovertyAssistanceInfo(
  insertStudentPovertyAssistanceList: StudentPovertyAssistance[]
): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student_poverty_assistance/adds', { studentPovertyAssistances: insertStudentPovertyAssistanceList })
}
