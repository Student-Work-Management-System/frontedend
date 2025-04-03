
export interface Grade {
    // 年级Id
    gradeId?: string
    // 年级名称
    gradeName: string
}

export interface Degree {
    // 学历层次Id
    degreeId?: string
    // 学历层次名称
    degreeName: string
}

export interface Politics {
    // 政治面貌Id
    politicId?: string
    // 政治面貌名称
    politicStatus: string
}

export interface Major {
    majorId?: string
    majorName: string
}

export interface Counselor {
    uid: string
    gradeId: string
    degreeId: string
}

export interface CounselorQuery {
    search: string
    gradeId: string | null
    degreeId: string | null
    pageNo: number
    pageSize: number
}

export interface CounselorItem {
    uid: string
    counselorUsername: string
    counselorName: string
    counselorPhone: string
    chargeGrade: string[]
}

export interface UserWithCounselorRole {
    uid: string
    username: string
    realName: string
}

export interface CounselorRequest {
    uid: string
    chargeGrade: string[]
}


