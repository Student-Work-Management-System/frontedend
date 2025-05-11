export interface Status {
    statusId?: string
    statusName: string
}

export interface StudentStatus {
    studentStatusId?: string,
    studentId: string,
    statusId: string,
    log?: string,
    modifedTime?: string
}

export interface StudentStatusQuery {
    search: string,
    statusId: string | null
    majorId: string | null
    gradeId: string | null
    pageNo: number
    pageSize: number
}

export interface StudentStatusItem {
    studentStatusId: string
    studentId: string
    name: string
    majorName: string
    gradeName: string
    statusId: string
    statusName: string
    log: string
    modifiedTime: string
}

export interface StudentStatusStatQuery {
    gradeId: string | null
    majorId: string | null
}

export interface StudentStatusStatGroup {
    gradeName: string
    majors: MajorGroup[]
}

export interface MajorGroup {
    majorName: string
    status: StatusGroup[]
}

export interface StatusGroup {
    statusName: string
    number: string
}
