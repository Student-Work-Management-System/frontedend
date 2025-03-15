import http from '.'
import type { Result } from '.'
import { type AxiosResponse } from 'axios'
import type { Grade, Degree, Politics, Major } from '@/model/otherModel'


export function apiGetAllGrades(): Promise<AxiosResponse<Result<Grade[]>>> {
    return http.get('/other/allGrade')
}

export function apiGetAllDegrees(): Promise<AxiosResponse<Result<Degree[]>>> {
    return http.get('/other/allDegree')
}

export function apiGetAllPolitics(): Promise<AxiosResponse<Result<Politics[]>>> {
    return http.get('/other/allPolitic')
}

export async function apiGetMajorList(): Promise<AxiosResponse<Result<Major[]>>> {
    return http.get('/other/getAllMajors')
}

export async function apiAddMajor(major: Major): Promise<AxiosResponse<Result<null>>> {
    return http.post('/other/addMajor', major)
}

export async function apiDeleteMajor(majorId: string): Promise<AxiosResponse<Result<null>>> {
    return http.delete(`/other/deleteMajor/${majorId}`)
}

export async function apiUpdateMajor(major: Major): Promise<AxiosResponse<Result<null>>> {
    return http.put('/other/updateMajor', major)
}