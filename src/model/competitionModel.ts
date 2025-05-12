export const competitionTypeOptions = ["A类", "B类", "C类", "D类", "其他"]

export const competitionNatureOptions = ["团队", "单人"]

export interface Competition {
    competitionId?: string
    competitionName: string
    subCompetitionName: string
    competitionNature: string
    competitionType: string
}

export interface StudentCompetition {
    studentCompetitionId?: string
    competitionId: string
    headerId: string
    evidence: string
    level: string
    date: string
}

export interface StudentCompetitionTeam {
    studentCompetitionId: string
    studentId: string
}

export interface StudentCompetitionAudit {
    studentCompetitionId: string
    state: string
    rejectReason: string
    operatorId: string
    operatorTime: string
}

export interface CompetitionQuery {
    search: string
    competitionNature: string | null
    competitionType: string | null
    pageNo: number
    pageSize: number
}

export interface StudentCompetitionQuery {
    search: string
    majorId: string | null
    gradeId: string | null
    degreeId: string | null
    competitionNature: string | null
    competitionType: string | null
    level: string | null
    start: string | null
    end: string | null
    state: string | null
    pageNo: number
    pageSize: number
}

export interface StudentCompetitionWithMember {
    competitionId: string
    headerId: string
    evidence: string
    level: string
    date: string
    studentIds: string[]
}

export interface StudentCompetitionItem {
    studentCompetitionId: string
    competitionId: string
    competitionName: string
    competitionNature: string
    competitionType: string
    level: string
    headerId: string
    headerName: string
    evidence: string
    date: string
    team: TeamItem[]
    state: string
    rejectReason: string
}

export interface TeamItem {
    studentId: string
    name: string
    majorName: string
    gradeName: string
    degreeName: string
}

export interface CompetitionStatQuery {
    gradeId: string | null
    majorId: string | null
}

export interface CompetitionStatGroup {
    gradeName: string;
    majors: MajorGroup[];
}

export interface MajorGroup {
    majorId: string;
    types: TypeGroup[];
}

export interface TypeGroup {
    type: string;
    competitions: CompetitionGroup[];
}

export interface CompetitionGroup {
    competitionTotalName: string;
    levels: LevelGroup[];
}

export interface LevelGroup {
    level: string;
    count: string;
}
