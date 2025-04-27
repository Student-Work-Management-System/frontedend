export interface Scholarship {
    scholarshipId?: string
    scholarshipName: string
    scholarshipLevel: string
}

export interface StudentScholarship {
    studentScholarshipId?: string
    studentId?: string
    scholarshipId: string
    awardYear: string
}

export interface ScholarshipQuery {
    search: string
    gradeId: string | null
    majorId: string | null
    scholarshipLevel: string | null
    awardYear: string | null
    pageNo: number
    pageSize: number
}

export interface StudentScholarshipItem {
    studentScholarshipId: string
    studentId: string
    name: string
    gradeName: string
    majorName: string
    scholarshipId: string
    scholarshipName: string
    scholarshipLevel: string
    awardYear: string
}

export interface ScholarshipStatQuery {
    gradeId: string | null
    majorId: string | null
    level: string | null
    time: string | null
}

export interface StudentScholarshipStatGroup {
    gradeName: string
    studentScholarshipStatItems: StudentScholarshipStatItem[]
}

export interface StudentScholarshipStatItem {
    majorName: string
    scholarshipStatItems: ScholarshipStatItem[]
}

export interface ScholarshipStatItem {
    scholarshipName: string
    scholarshipLevel: string
    total: string
}
