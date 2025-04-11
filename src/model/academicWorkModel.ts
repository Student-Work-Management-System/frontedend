export type AcademicWorkType = 'paper' | 'soft' | 'patent'
export type AcademicWorkState = '审核中' | '通过' | '拒绝'

export function isStudentPaper(work: AcademicWork): work is StudentPaper {
    return (work as StudentPaper).studentPaperId !== undefined
}

export function isStudentSoft(work: AcademicWork): work is StudentSoft {
    return (work as StudentSoft).studentSoftId !== undefined
}

export function isStudentPatent(work: AcademicWork): work is StudentPatent {
    return (work as StudentPatent).studentPatentId !== undefined
}

export interface AcademicWork {

}

export interface StudentPaper extends AcademicWork {
    studentPaperId: string
    periodicalName: string
    jrcPartition: string
    casPartition: string
    recordedTime: string
    searchedTime: string
    isMeeting: boolean
    isChineseCore: boolean
    isEI: boolean
    isEIRecorded: boolean
}

export interface StudentSoft extends AcademicWork {
    studentSoftId: string
    publishInstitution: string
    publishDate: string
}

export interface StudentPatent extends AcademicWork {
    studentPatentId: string
    publishState: string
    publishDate: string
    acceptDate: string
    authorizationDate: string
}

export interface StudentAcademicWork {
    studentAcademicWorkId?: string
    uid: string
    workName: string
    type: string
    referenceId: string
    evidence: string
}

export interface StudentAcademicWorkAudit {
    studentAcademicWorkId: string
    state: AcademicWorkState
    rejectReason: string | null
    operatorId: string | null
}

export interface StudentAcademicWorkMember {
    memberId?: string
    studentAcademicWorkId: string
    memberOrder: string
    uid: string
}

export interface AcademicWorkMember {
    memberOrder: string
    uid: string
}

export interface AcademicWorkRequest {
    studentAcademicWorkId?: string
    uid: string
    workName: string
    state?: AcademicWorkState
    type: AcademicWorkType
    team: AcademicWorkMember[]
    evidence: string
    academic: AcademicWork | null
}

export interface AcademicWorkQuery {
    search: string
    state: AcademicWorkState
    type: AcademicWorkState
    pageNo: number
    pageSize: number
}

export interface StudentAcademicWorkMemberItem {
    memberOrder: string
    uid: string
    isStudent: boolean
    username: string
    realName: string
    majorName: string
    gradeName: string
    degreeName: string
}

export interface StudentAcademicWorkItem {
    studentAcademicWorkId: string
    username: string
    realName: string
    workName: string
    type: AcademicWorkType
    referenceId: string
    academicWork: AcademicWork
    team: StudentAcademicWorkMemberItem[]
    operatorId: string
    operatorTime: string
    evidence: string
    state: AcademicWorkState
    rejectReason: string
}

export interface AcademicWorkUser { 
    uid: string
    username: string
    realName: string
}