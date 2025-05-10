export interface Punishment {
    punishmentId?: string
    punishmentName: string
}

export interface StudentPunishment {
    studentPunishmentId?: string
    punishmentId: string
    studentId: string
    reason: string
    date: string
}


export interface StudentPunishmentQuery {
    search: string
    gradeId: string | null
    majorId: string | null
    punishmentId: string | null
    pageNo: number
    pageSize: number
}

export interface StudentPunishmentItem {
    studentPunishmentId: string
    studentId: string
    name: string
    majorName: string
    gradeName: string
    punishmentId: string
    punishmentName: string
    reason: string
    date: string
}

export interface StudentPunishmentStatQuery {
    gradeId: string
    majorId: string
}

export interface StudentPunishmentStatGroup {
    gradeName: string
    majors: MajorGroup[]
}

export interface MajorGroup {
    majorName: string
    punishments: PunishmentGroup[]
}

export interface PunishmentGroup {
    punishmentName: string
    number: string
}
