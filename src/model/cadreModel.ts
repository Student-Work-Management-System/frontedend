export interface Cadre {
    cadreId: string
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

