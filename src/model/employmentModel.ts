export interface StudentEmployment {
    studentEmploymentId?: string
    studentId: string
    graduationYear: string
    whereabouts: string
    code: string
    organizationName: string
    jobNature: string
    jobIndustry: string
    jobLocation: string
    category: string
    salary: string
    state: string
    contactPerson: string
    contactPhone: string
    certificateTime: string
    comment: string
}

export interface EmploymentQuery {
    search: string
    gender: string | null
    majorId: string | null
    gradeId: string | null
    degreeId: string | null
    politicId: string | null
    graduationYear: string | null
    pageNo: number
    pageSize: number
}

export interface StudentEmploymentItem {
    studentEmploymentId: string
    studentId: string
    idNumber: string
    name: string
    gender: string
    nation: string
    phone: string
    email: string
    gradeName: string
    majorName: string
    degreeName: string
    politicStatus: string
    studentFrom: string
    enrollmentTime: string
    classNo: string
    location: string
    graduationYear: string
    householdType: string
    whereabouts: string
    organizationName: string
    code: string
    category: string
    jobNature: string
    jobIndustry: string
    jobLocation: string
    salary: string
    contactPerson: string
    contactPhone: string
    certificateTime: string
    state: string
    comment: string
}

export interface EmploymentStatQuery {
    gradeId: string | null
    majorId: string | null
}

export interface EmploymentStatGroup {
    gradeName: string
    majors: MajorGroup[]
}

export interface MajorGroup {
    majorName: string
    employments: StudentEmploymentGroup[]
}

export interface StudentEmploymentGroup {
    whereabouts: string
    number: number | string
}

