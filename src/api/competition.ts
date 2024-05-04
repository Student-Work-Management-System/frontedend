import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'

type competitionLevel = "A类" | "B类" | "C类" | "D类" | "其他" | null
export const competitionOptions = ["A类", "B类", "C类", "D类", "其他"]

export interface Competition {
  competitionId: string
  competitionName: string
  competitionNature: string | null
  competitionLevel: competitionLevel
}

export interface Memeber {
  order: number
  studentId: string
  realName: string
}

export interface StudentCompetition {
  competitionName: string
  /**
   * 竞赛性质： 团队/单人
   */
  competitionNature: string
  /**
   * 竞赛级别
   */
  competitionLevel: string
  /**
   * 填报人学号/队长学号
   */
  headerId: string
  headerName: string
  /**
   * 证明材料，这里填写文件地址
   */
  evidence: string
  /**
   * 奖项级别，由学生填报
   */
  awardLevel: string
  /**
   * 获奖日期
   */
  awardDate: Date
  /**
   * 团队成员, 单人比赛时为空。团队赛时应该填入的格式为 [{ order: 1, studentId:"",realName:""}....]
   */
  members: Memeber[]
  /**
   * 上报后审核状态
   */
  reviewState: string
  /**
   * 仅当状态预修改为 已拒绝 时才可以填写
   */
  rejectReason: string
}

export async function apiGetStudentOwnCompetition(studentId: string): Promise<AxiosResponse<Result<StudentCompetition[]>>> {
  return http.get(`/student_competition/get/${studentId}`)
}


export async function apiAddCompetitions(competitions: Competition[]): Promise<AxiosResponse<Result<null>>> {
  return http.post('/competition/adds', { competitions })
}

export async function apiAddCompetition(competition: Competition): Promise<AxiosResponse<Result<null>>> {
  return http.post('/competition/add', competition)
}

export async function apiGetCompetitions(query: { pageNo: number, pageSize: number }): Promise<AxiosResponse<Result<RecordsPage<Competition>>>> {
  return http.get('/competition/gets', { params: query })
}

export async function apiUpdateCompetition(competition: Competition): Promise<AxiosResponse<Result<null>>> {
  return http.put('/competition/update', competition)
}

export async function apiDeleteCometition(competitionId: string): Promise<AxiosResponse<Result<null>>> {
  return http.delete(`/competition/delete/${competitionId}`)
}
