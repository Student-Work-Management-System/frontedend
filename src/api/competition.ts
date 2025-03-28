import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { Competition, CompetitionQuery, StudentCompetitionAudit, StudentCompetitionItem, StudentCompetitionQuery, StudentCompetitionWithMember, } from '@/model/competitionModel'

export async function apiGetCompetitions(query: CompetitionQuery): Promise<AxiosResponse<Result<RecordsPage<Competition>>>> {
  return http.post('/competition/gets', query)
}

export async function apiImportCompetition(competitions: Competition[]): Promise<AxiosResponse<Result<void>>> {
  return http.post('/competition/adds', competitions)
}

export async function apiAddCompetition(competition: Competition): Promise<AxiosResponse<Result<void>>> {
  return http.post('/competition/add', competition)
}

export async function apiUpdateCompetition(competition: Competition): Promise<AxiosResponse<Result<void>>> {
  return http.put('/competition/update', competition)
}

export async function apiDeleteCompetition(competitionId: string): Promise<AxiosResponse<Result<void>>> {
  return http.delete(`/competition/delete/${competitionId}`)
}

export async function apiGetOwnCompetition(): Promise<AxiosResponse<Result<StudentCompetitionItem[]>>> {
  return http.get('/student_competition/getOwn')
}

export async function apiAddStudentCompetition(studentCompetitionWithMember: StudentCompetitionWithMember): Promise<AxiosResponse<Result<void>>> {
  return http.post('/student_competition/add', studentCompetitionWithMember)
}

export async function apiDeleteStudentCompetition(studentCompetitionId: string): Promise<AxiosResponse<Result<void>>> {
  return http.delete(`/student_competition/delete/${studentCompetitionId}`)
}

export async function apiUpdateStudentCompetition(StudentCompetitionAudit: StudentCompetitionAudit): Promise<AxiosResponse<Result<void>>> {
  return http.post('/student_competition/update', StudentCompetitionAudit)
}

export async function apiGetStudentCompetitions(query: StudentCompetitionQuery): Promise<AxiosResponse<Result<RecordsPage<StudentCompetitionItem>>>> {
  return http.post('/student_competition/gets', query)
}
