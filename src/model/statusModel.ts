export interface Status {
    statusId?: string
    statusName: string
}

export interface StudentStatus {
    studentStatusId?: string,
    studentId: string,
    statusId: string,
    log: string,
    modifedTime: string
}

export interface StudentStatusQuery {
    search: string,
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
    statusName: string
    log: string
    modifiedTime: string
}