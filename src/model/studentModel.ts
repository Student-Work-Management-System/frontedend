export interface StudentBasicItem {
    studentId: string
    name: string
    gender: string
    majorName: string
    gradeName: string
    degreeName: string
}

export interface StudentStatItem {
    majorName: string
    // 总人数
    totalCount: number
    // 在籍
    normalCount: number
    // 休学
    suspendCount: number
    // 入伍
    militaryCount: number
    // 复学
    returnCount: number
    // 转入
    transferInCount: number
    // 转出
    transferOutCount: number
    // 放弃入学资格
    dropOfEnrollmentCount: number
    // 保留入学资格
    retainEnrollmentCount: number
    // 结业
    graduationCount: number
    // 毕业
    gradCount: number
    // 退学
    droppedCount: number
    // 改名
    rechristenCount: number
    // 死亡
    deathCount: number
    // 性别
    maleCount: number
    femaleCount: number
    // 群众数量
    massCount: number
    // 共青团员
    leagueCount: number
    // 中共党员
    partyCount: number
    // 预备党员
    prepareCount: number
    // 残疾学生
    disabilityCount: number
    // 少数民族
    minorityCount: number
}

export interface StudentStatQuery {
    gradeId: string | null
    degreeId: string | null
}

export interface HeaderTeacher {
    headerTeacherUsername: string
    headerTeacherRealName: string
    headerTeacherPhone: string
}
