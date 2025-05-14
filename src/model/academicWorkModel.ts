export type AcademicWorkType = 'paper' | 'soft' | 'patent'
export type AcademicWorkState = '审核中' | '通过' | '拒绝'

export function isPaper(work: AbstractAcademicWork): work is AcademicWorkPaper {
    return (work as AcademicWorkPaper).paperId !== undefined
}

export function isSoft(work: AbstractAcademicWork): work is AcademicWorkSoft {
    return (work as AcademicWorkSoft).softId !== undefined
}

export function isPatent(work: AbstractAcademicWork): work is AcademicWorkPatent {
    return (work as AcademicWorkPatent).patentId !== undefined
}

export interface AbstractAcademicWork {

}

export interface AcademicWorkPaper extends AbstractAcademicWork {
    paperId?: string
    periodicalName: string
    jrcPartition: string
    casPartition: string
    recordedTime: string
    searchedTime: string
    isMeeting: boolean
    isChineseCore: boolean
    isEI: boolean
    isEIRecorded: boolean
    type: AcademicWorkType
}

export interface AcademicWorkSoft extends AbstractAcademicWork {
    softId?: string
    publishInstitution: string
    publishDate: string
    type: AcademicWorkType
}

export interface AcademicWorkPatent extends AbstractAcademicWork {
    patentId?: string
    publishState: string
    publishDate: string
    acceptDate: string
    authorizationDate: string
    type: AcademicWorkType
}

export interface AcademicWork {
    academicWorkId?: string
    username: string
    workName: string
    type: string
    referenceId: string
    evidence: string
}

export interface AcademicWorkAudit {
    academicWorkId: string
    state: AcademicWorkState
    rejectReason: string | null
    operatorId: string | null
}

export interface AcademicWorkMember {
    memberId?: string
    academicWorkId: string
    memberOrder: string
    username: string
}

export interface AcademicWorkMemberRequest {
    memberOrder: string
    username: string
}

export interface AcademicWorkRequest {
    academicWorkId?: string
    username: string
    workName: string
    state?: AcademicWorkState
    type: AcademicWorkType
    team: AcademicWorkMemberRequest[]
    evidence: string
    academicWork: AbstractAcademicWork | null;
}

export interface AcademicWorkQuery {
    search: string
    state: AcademicWorkState | null
    type: AcademicWorkType | null
    pageNo: number
    pageSize: number
}

export interface AcademicWorkMemberItem {
    memberOrder: string
    isStudent: boolean
    username: string
    realName: string
    majorName: string
    gradeName: string
    degreeName: string
}

export interface AcademicWorkItem {
    academicWorkId: string
    username: string
    realName: string
    workName: string
    type: AcademicWorkType
    referenceId: string
    academicWork: AbstractAcademicWork
    team: AcademicWorkMemberItem[]
    operatorId: string
    operatorTime: string
    evidence: string
    state: AcademicWorkState
    rejectReason: string
}

export interface AcademicWorkUser {
    username: string
    realName: string
}

export interface PaperStat {
    meetingNumber: string
    chineseCoreNumber: string
    ei_Number: string
}

export interface PatentStat {
    number: string
    totalNumber: string
}

export interface SoftStat {
    number: string
}

export interface AcademicWorkStatGroup {
    paperStat: PaperStat
    patentStat: PatentStat
    softStat: SoftStat
}