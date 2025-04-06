export interface StudentPunishment {
    studentPunishmentId?: string
    studentId: string
    level: string
    reason: string
    date: string
}

export interface StudentPunishmentQuery {
    search: string
    gradeId: string | null
    majorId: string | null
    level: string | null
    pageNo: number
    pageSize: number
}

export interface StudentPunishmentItem {
    studentPunishmentId: string
    studentId: string
    name: string
    majorName: string
    gradeName: string
    level: string
    reason: string
    date: string
}