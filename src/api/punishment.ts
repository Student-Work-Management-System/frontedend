import type { AxiosResponse } from "axios"
import http, { type RecordsPage, type Result } from "."
import type { StudentPunishment, StudentPunishmentItem, StudentPunishmentQuery } from "@/model/punishmentModel"

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

export const levels: string[] = ["警告", "严重警告", "记过", "留校查看", "开除学籍"]