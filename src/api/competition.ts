import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { Competition, CompetitionQuery, StudentCompetitionAudit, StudentCompetitionItem, StudentCompetitionQuery, StudentCompetitionWithMember, CompetitionStatQuery, CompetitionStatGroup } from '@/model/competitionModel'

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
  return http.get('/competition/student/getOwn')
}

export async function apiAddStudentCompetition(studentCompetitionWithMember: StudentCompetitionWithMember): Promise<AxiosResponse<Result<void>>> {
  return http.post('/competition/student/add', studentCompetitionWithMember)
}

export async function apiDeleteStudentCompetition(studentCompetitionId: string): Promise<AxiosResponse<Result<void>>> {
  return http.delete(`/competition/student/delete/${studentCompetitionId}`)
}

export async function apiUpdateStudentCompetition(studentCompetitionAudits: StudentCompetitionAudit[]): Promise<AxiosResponse<Result<void>>> {
  return http.put('/competition/student/update', studentCompetitionAudits)
}

export async function apiGetStudentCompetitions(query: StudentCompetitionQuery): Promise<AxiosResponse<Result<RecordsPage<StudentCompetitionItem>>>> {
  return http.post('/competition/student/gets', query)
}

export async function apiGetStat(query: CompetitionStatQuery): Promise<AxiosResponse<Result<CompetitionStatGroup[]>>> {
  return http.post("/competition/student/stat", query)
}