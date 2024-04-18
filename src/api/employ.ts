import http from '.'
import { type Result } from '.'
import { Axios, type AxiosResponse } from 'axios'

export interface Major {
  majorId: string
  majorName: string
}

export interface Employ {
  studentId: string
  graduationState: string
  graduationYear: string
  whereabouts: string
  jobNature: string
  jobIndustry: string
  jobLocation: string
  category: string
  salary: string
}


export function apiAddEmployInfo(employs: Employ[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/employment/adds', { insertStudentEmploymentDTOList: employs })
}
