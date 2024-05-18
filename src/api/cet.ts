import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'

export interface StudentCet {
  studentId: string
  score: number
  examDate: string
  certificateNumber: string
  examType: string
}

export interface CETQuery {
  name: string | null
  majorId: string | null
  grade: string | null
  score: number | null
  examDate: string | null
  examType: string | null
  pageNo: number
  pageSize: number
}

export interface CETS {
  studentCetId: string
  score: number
  examDate: string
  certificateNumber: string
  examType: string
}

export interface StudentCetVO {
  studentCetId: string
  studentId: string
  name: string
  majorName: string
  grade: string
  cets: CETS[]
}

export interface UpdateStudentCetDTO {
  studentCetId: string
  studentId: string
  score: number
  examDate: string
  certificateNumber: string
  examType: string
}

export async function apiImportCETScore(insertStudentCetDTOList: {
  studentId: string
  score: number
  examDate: string
  certificateNumber: string
  examType: string
}[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/cet/adds', { insertStudentCetDTOList })
}

export async function apiInsertStudentCet(studentCet: {
  studentId: string
  score: number
  examDate: string
  certificateNumber: string
  examType: string
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/cet/add', studentCet)
}

export async function apiGetAllRecord(cetQuery: CETQuery): Promise<AxiosResponse<Result<RecordsPage<StudentCetVO>>>> {
  return http.post('/cet/gets', cetQuery)
}

export async function apiGetOptionalExamDate(): Promise<AxiosResponse<Result<null>>> {
  return http.get('/cet/gets/optional_exam_date')
}

export async function apiUpdateStudentCET(studentCet: UpdateStudentCetDTO): Promise<AxiosResponse<Result<null>>> {
  return http.put('/cet/update', studentCet)
}

export async function apiDeleteStudentCET(studentCETId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/cet/delete/${studentCETId}`)
}

export async function apiCetStats(query: {
  examTimes: string[]
  majorIds: string[]
}): Promise<AxiosResponse<Result<null>>> {
  return http.post('/cet/stat', query)
}

// export async function apiCetDownloadStatExcel(query: {
//   examTimes: string[]
//   majorIds: string[]
// }): Promise<AxiosResponse<Result<{ [key: string]: EnrollStats }>>> {
//   return http.post('/cet/stat', query)
// }
