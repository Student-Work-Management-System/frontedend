export interface StudentPrecaution {
    studentPrecautionId?: string;
    studentId?: string;
    levelCode: '0' | '1' | '2' | null
    term: string; // Format: YYYY-YYYY_term (e.g., 2023-2024_1)
    detail: string;
    status?: boolean;
    handlerId?: string;
    createdAt?: string;  // Format: YYYY-MM-DD
    updatedAt?: string;  // Format: YYYY-MM-DD
    handledAt?: string;  // Format: YYYY-MM-DD
}

export interface PrecautionQuery {
    search: string
    detailSearch: string
    gradeId: string | null
    majorId: string | null
    levelCode: string | null
    startTerm: string | null
    endTerm: string | null
    pageNo: number
    pageSize: number
}

export interface PrecautionStatQuery {
    gradeId: string | null
    majorId: string | null
    startTerm: string | null
    endTerm: string | null
}

export interface StudentPrecautionItem {
    studentPrecautionId: string;
    studentId?: string;
    name?: string;
    gradeName?: string
    majorName?: string
    levelCode: '0' | '1' | '2' | null
    term: string;
    detail: string;
    status?: boolean;
    handlerName?: string;
    handledAt?: string;  // Format: YYYY-MM-DD
}

export interface StudentPrecautionStatGroup {
    gradeName: string;
    majors: MajorGroup[];
}

export interface MajorGroup {
    majorName: string;
    terms: TermGroup[];
}

export interface TermGroup {
    term: string;
    levels: LevelGroup[];
}

export interface LevelGroup {
    levelCode: '0' | '1' | '2' | null
    handledNumber: string;
    allNumber: string;
}
