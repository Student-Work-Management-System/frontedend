// 贫困资助记录
export interface PovertyAssistance {
    povertyAssistanceId?: string
    povertyLevel: string
    povertyType: string
    povertyAssistanceStandard: string
}

// 学生贫困资助认定
export interface StudentPovertyAssistance {
    studentPovertyAssistanceId?: string
    studentId: string
    povertyAssistanceId: string
    assistanceYear: string
}

// 学生贫困资助认定列表相关数据
export interface StudentPovertyAssistanceItem {
    studentPovertyAssistanceId: string
    studentId: string
    povertyAssistanceId: string
    name: string
    majorName: string
    gradeName: string
    povertyLevel: string
    povertyType: string
    povertyAssistanceStandard: string
    assistanceYear: string
}

export interface PovertyAssistanceQuery {
    search: string
    gradeId: string | null
    majorId: string | null
    povertyLevel: string | null
    assistanceYear: string | null
    pageNo: number
    pageSize: number
}

export interface PovertyAssistanceStatQuery {
}

export interface PovertyAssistanceStatItem {

}