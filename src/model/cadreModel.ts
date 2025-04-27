export interface Cadre {
    cadreId?: string
    cadrePosition: string
    cadreLevel: string
    cadreBelong: string
}

export interface StudentCadre {
    studentCadreId?: string
    studentId: string
    cadreId: string
    appointmentStartTerm: string
    appointmentEndTerm: string
    comment: string
}

export interface StudentCadreItem {
    studentCadreId?: string
    studentId: string
    name: string
    gender: string
    majorName: string
    gradeName: string
    cadreId: string
    cadrePosition: string
    cadreLevel: string
    cadreBelong: string
    appointmentStartTerm: string
    appointmentEndTerm: string
    comment: string
}

export interface CadreQuery {
    search: string
    majorId: string | null
    gradeId: string | null
    cadreLevel: string | null
    appointmentStartTerm: string | null
    appointmentEndTerm: string | null
    pageNo: number
    pageSize: number
}


export interface CadreStatQuery {
    gradeId: string | null
    majorId: string | null
    cadreLevel: string | null
    startTerm: string | null
    endTerm: string | null
}

export interface StudentCadreStatGroup {
    gradeName: string
    studentCadreStatItems: StudentCadreStatItem[]
}

export interface StudentCadreStatItem {
    majorName: string
    cadreStatItems: CadreStatItem[]
}

export interface CadreStatItem {
    cadreLevel: string
    cadreBelong: string
    total: string
}
