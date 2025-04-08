import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { StudentEmployment, StudentEmploymentItem, EmploymentQuery } from '@/model/employmentModel'

export const stateOption: string[] = [
  "本届毕业", "毕业", "结业", "休学", "续读"
]

export const whereaboutsOption: string[] = [
  "不毕业拟升学", "出国/出境", "第二学士学位", "科研助理/管理助理",
  "拟参加公招考试", "拟出国/出境", "拟创业", "其他录用形式就业",
  "其他地方基层", "签就业协议形式就业", "签劳动合同形式就业",
  "签约中", "求职中", "选调生", "研究生", "应征义务兵",
  "暂不就业", "自主创业"
]

export function apiAddEmployInfo(studentEmployments: StudentEmployment[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/employment/adds', studentEmployments)
}

export function apiGetEmployList(query: EmploymentQuery): Promise<AxiosResponse<Result<RecordsPage<StudentEmploymentItem>>>> {
  return http.post('/employment/gets', query)
}

export function apiUpdateEmploy(employment: StudentEmployment): Promise<AxiosResponse<Result<null>>> {
  return http.put('/employment/update', employment)
}

export function apiDeleteEmploy(employId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/employment/delete/${employId}`,)
}

export interface EmployStats {
  graduationStatus: any
  jobIndustry: any
  jobLocation: any
  salary: string
}

export function apiStatsEmploy(query: {
  graduationYears: string[] | null
  majorIds: string[] | null
}): Promise<AxiosResponse<Result<{ [key: string]: EmployStats }>>> {
  return http.post('/employment/stat', query)
}

export function apiDownloadStatsEmploy(query: {
  graduationYears: string[]
  majorIds: string[]
}): Promise<AxiosResponse<Blob>> {
  return http.post('/employment/download', query, { responseType: 'blob' })
}
