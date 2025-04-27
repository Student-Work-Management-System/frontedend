export interface Language {
    languageId?: string
    languageName: string
    type: string
    total: string
}

export interface ForeignLanguage {
    foreignLanguageId?: string
    studentId?: string
    languageId: string
    score: string
    date: string
    certificate: string
}

export interface ForeignLanguageItem {
    foreignLanguageId: string
    studentId?: string
    name?: string
    majorName?: string
    gradeName?: string
    languageId: string
    languageName?: string
    score: string
    type: string
    date: string
    certificate: string
}

export interface ForeignLanguageQuery {
    search: string
    majorId: string | null
    gradeId: string | null
    degreeId: string | null
    languageId: string | null
    date: string | null
    certificate: string | null
    pageNo: number
    pageSize: number
}

export interface ForeignLanguageStatQuery {
    gradeId: string | null
    majorId: string | null
    languageId: string | null
    term: string | null
}

export interface LanguageStatItem {
    languageName: string
    passNumber: string
    totalNumber: string
}

export interface ForeignLanguageStatItem {
    majorName: string
    languageStatItems: LanguageStatItem[]
}

export interface ForeignLanguageStatGrouped {
    gradeName: string
    foreignLanguageStatItems: ForeignLanguageStatItem[]
}

