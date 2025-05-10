import type { AxiosResponse } from "axios"
import http, { type RecordsPage, type Result, type BaseQuery } from "."
import type { Punishment, StudentPunishment, StudentPunishmentItem, StudentPunishmentQuery, StudentPunishmentStatGroup, StudentPunishmentStatQuery } from "@/model/punishmentModel"

export async function apiGetStudentPunishment(query: StudentPunishmentQuery): Promise<AxiosResponse<Result<RecordsPage<StudentPunishmentItem>>>> {
    return http.post("/punishment/student/gets", query)
}

export async function apiAddStudentPunishment(studentPunishment: StudentPunishment[]): Promise<AxiosResponse<Result<void>>> {
    return http.post("/punishment/student/adds", studentPunishment)
}

export async function apiUpdateStudentPunishment(studentPunishment: StudentPunishment): Promise<AxiosResponse<Result<void>>> {
    return http.put("/punishment/student/update", studentPunishment)
}

export async function apiDeleteStudentPunishment(studentPunishmentId: string): Promise<AxiosResponse<Result<void>>> {
    return http.delete(`/punishment/student/delete/${studentPunishmentId}`)
}

export async function apiGetStat(query: StudentPunishmentStatQuery): Promise<AxiosResponse<Result<StudentPunishmentStatGroup[]>>> {
    return http.post("/punishment/stat", query)
}

export async function apiGetPunishments(query: BaseQuery): Promise<AxiosResponse<Result<RecordsPage<Punishment>>>> {
    return http.post("/punishment/gets", query)
}

export async function apiAddPunishmentItem(punishment: Punishment): Promise<AxiosResponse<Result<void>>> {
    return http.post("/punishment/add", punishment)
}

export async function apiUpdatePunishmentItem(punishment: Punishment): Promise<AxiosResponse<Result<void>>> {
    return http.put("/punishment/update", punishment)
}

export async function apiDeletePunishmentItem(punishmentId: string): Promise<AxiosResponse<Result<void>>> {
    return http.delete(`/punishment/delete/${punishmentId}`)
}