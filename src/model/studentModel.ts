import type { AbstractAcademicWork, AcademicWorkMemberItem } from "./academicWorkModel"
import type { TeamItem } from "./competitionModel"

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

export interface EnrollmentBase {
    studentId: string;
    idNumber: string; // 身份证号
    name: string; // 姓名
    gender: string; // 性别
    birthdate: string; // 生日
    hobbies: string; // 个人兴趣爱好特长
    nativePlace: string; // 籍贯
    nation: string; // 民族
    height: string; // 身高
    weight: string; // 体重
    politicStatus: string; // 政治面貌
    phone: string; // 联系手机
    email: string; // 邮箱
    headerTeacherUsername: string; // 班主任工号
    headerTeacherRealName: string; // 班主任姓名
    headerTeacherPhone: string; // 班主任联系方式
    dormitory: string; // 宿舍号
    classNo: string; // 班级
    majorName: string; // 专业名
    degreeName: string; // 培养层次名
    gradeName: string; // 年级名
    studentType: string; // 类型
    admissionBatch: string; // 批次
    subjectCategory: string; // 科类
    provinceName: string; // 省份名称
    examId: string; // 考生号
    admittedMajor: string; // 录取专业
    volunteerMajor: string; // 投档志愿
    volunteerCollege: string; // 投档单位
    totalExamScore: string; // 高考总分
    convertedScore: string; // 总分
    specialScore: string; // 特征成绩
    feature: string; // 考生特征
    volunteer1: string; // 志愿1
    volunteer2: string; // 志愿2
    volunteer3: string; // 志愿3
    volunteer4: string; // 志愿4
    volunteer5: string; // 志愿5
    volunteer6: string; // 志愿6
    studentFrom: string; // 生源地
    isAdjusted: boolean; // 调剂
    receiver: string; // 收件人
    receiverPhone: string; // 联系电话
    postalCode: string; // 邮政编码
    householdRegistration: string; // 户籍所在地
    householdType: string; // 户口类型
    address: string; // 地址
    fatherName: string; // 父亲姓名
    fatherPhone: string; // 父亲联系方式
    fatherOccupation: string; // 父亲职业
    motherName: string; // 母亲姓名
    motherPhone: string; // 母亲联系方式
    motherOccupation: string; // 母亲职业
    guardian: string; // 监护人姓名
    guardianPhone: string; // 监护人联系方式
    familyPopulation: string; // 家庭人口
    familyMembers: string; // 家庭成员
    familyLocation: string; // 家庭所在地
    isOnlyChild: boolean; // 是否独生子女
    highSchoolCode: string; // 中学代码
    highSchoolName: string; // 中学名称
    candidateCategoryClassification: string; // 考生类别分类
    graduationCategoryClassification: string; // 毕业类别分类
    graduationCategory: string; // 毕业类别
    candidateCategory: string; // 考生类别
    foreignLanguage: string; // 高考外语语种
    scoreChinese: string; // 语文
    scoreMath: string; // 数学
    scoreForeignLanguage: string; // 外语
    scoreComprehensive: string; // 综合
    scorePhysics: string; // 物理
    scoreChemistry: string; // 化学
    scoreBiology: string; // 生物
    scorePolitics: string; // 政治
    scoreHistory: string; // 历史
    scoreGeography: string; // 地理
    scoreTechnology: string; // 技术
    selectedSubjects: string; // 选考科目
    studentLoans: boolean; // 助学贷款
    disability: boolean; // 残疾
    religiousBeliefs: string; // 宗教信仰
    otherNotes: string; // 备注
}

// StatusBase 对应的 TypeScript 接口
export interface StatusBase {
    statusName: string;
    log: string;
    modifiedTime: string; // 日期字符串，例如 "2025-05-14 12:00:00"
}

// ScholarshipBase 对应的 TypeScript 接口
export interface ScholarshipBase {
    scholarshipName: string;
    scholarshipLevel: string;
    awardYear: string; // 年份，如 "2024"
}

// PunishmentBase 对应的 TypeScript 接口
export interface PunishmentBase {
    punishmentName: string;
    reason: string;
    date: string; // 日期字符串，格式 "yyyy-MM-dd"，例如 "2024-11-20"
}

// 贫困资助信息
export interface PovertyAssistanceBase {
    povertyLevel: string;                 // 贫困等级
    povertyType: string;                  // 贫困类型
    povertyAssistanceStandard: string;    // 资助标准
    assistanceYear: string;               // 资助学年，如 "2023"
}

// 外语考试信息
export interface ForeignLanguageBase {
    languageName: string;    // 语种，如 "英语"
    score: string;           // 成绩
    type: string;            // 考试类型，如 "四六级"
    date: string;            // 考试时间（建议格式 "yyyy-MM-dd"）
    certificate: string;     // 证书编号或文件路径
}

// 重点关注信息
export interface PrecautionBase {
    levelCode: string;   // 预警等级代码，如 "A", "B", "C"
    term: string;        // 学期，如 "2023-2024-1"
    detail: string;      // 具体情况说明
}

// 学术作品基础信息
export interface AcademicWorkBase {
    studentAcademicWorkId: string;              // 学生作品ID
    realName: string;                           // 姓名
    workName: string;                           // 作品名称
    type: string;                               // 作品类型（如：论文、专利、软著）
    referenceId: string;                        // 引用ID（指向具体作品表）
    academicWork: AbstractAcademicWork;         // 作品详情对象（前端多态处理）
    team: AcademicWorkMemberItem[];             // 成员列表
    evidence: string;                           // 佐证材料路径或说明
}

// 竞赛基础信息
export interface CompetitionBase {
    studentCompetitionId: string;               // 学生竞赛记录ID
    competitionId: string;                      // 竞赛ID（指向竞赛基本信息）
    competitionName: string;                    // 竞赛名称
    subCompetitionName: string;                 // 分赛道名称
    competitionNature: string;                  // 竞赛性质（如：校级、省级等）
    competitionType: string;                    // 竞赛类型（如：个人、团队）
    level: string;                              // 获奖等级（如：一等奖）
    headerId: string;                           // 队长ID
    headerName: string;                         // 队长姓名
    evidence: string;                           // 佐证材料
    date: string;                               // 比赛时间（建议格式："yyyy-MM-dd"）
    team: TeamItem[];                           // 队伍成员列表
}

export interface StudentArchive {
    // 学籍信息
    enrollment: EnrollmentBase;

    // 状态记录（如请假、复学等）
    statuses: StatusBase[];

    // 奖惩信息
    scholarships: ScholarshipBase[];
    punishments: PunishmentBase[];

    // 贫困补助信息
    povertyAssistances: PovertyAssistanceBase[];

    // 学业信息
    foreignLanguages: ForeignLanguageBase[];
    precautions: PrecautionBase[];

    // 学术成果与竞赛获奖
    academicWorks: AcademicWorkBase[];
    competitions: CompetitionBase[];
}
