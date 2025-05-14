export interface EnrollmentQuery {
    search: string; // 个人信息搜索框: 学号、姓名、身份证、邮箱、手机号
    familySearch: string; // 家庭信息搜索框: 父母姓名、父母手机号、监护人姓名、监护人电话
    householdRegistration: string | null; // 户籍所在地
    householdType: string | null; // 户口类型
    isOnlyChild: boolean | null; // 独生子女
    schoolSearch: string; // 在校信息搜索框: 宿舍号、班号
    headerTeacherSearch: string; // 班主任信息搜索框: 班主任工号、姓名、联系方式
    highSchoolSearch: string; // 中学信息搜索框: 中学名称、中学代码
    candidateCategory: string | null; // 考生类别
    studentType: string | null; // 学生类型
    admissionBatch: string | null; // 录取批次
    gender: string | null; // 性别
    politicId: string | null; // 政治面貌
    majorId: string | null; // 专业
    gradeId: string | null; // 年级
    degreeId: string | null; // 培养层次
    statusId: string | null; // 学籍状态
    studentLoans: boolean | null; // 助学贷款
    disability: boolean | null; // 是否残疾
    religiousBeliefs: string | null; // 宗教信仰
    enabled: boolean | null;
    pageNo: number;
    pageSize: number;
}


export interface Enrollment {
    enrollmentId?: string; // 主键

    // 个人基础信息
    studentId: string; // 学号
    idNumber: string; // 身份证号
    name: string; // 姓名
    gender: string; // 性别
    birthdate: string | null; // 出生日期
    hobbies: string | null; // 个人兴趣爱好特长
    nativePlace: string | null; // 籍贯
    nation: string | null; // 民族
    height: string | null; // 身高
    weight: string | null; // 体重
    politicId: string; // 政治面貌
    phone: string; // 联系手机
    email: string; // 邮箱

    // 在校信息
    headerTeacherUsername: string; // 班主任工号
    dormitory: string | null; // 宿舍号
    classNo: string | null; // 班级
    majorId: string; // 专业
    gradeId: string; // 年级
    degreeId: string; // 培养层次

    // 高考信息
    studentType: string | null; // 学生类型
    admissionBatch: string | null; // 录取批次
    subjectCategory: string | null; // 科类
    provinceName: string | null; // 省份名称
    examId: string | null; // 考生号
    admittedMajor: string | null; // 录取专业
    volunteerMajor: string | null; // 投档志愿
    volunteerCollege: string | null; // 投档单位
    totalExamScore: string | null; // 高考总分
    convertedScore: string | null; // 总分（折算后）
    specialScore: string | null; // 特征成绩
    feature: string | null; // 考生特征
    volunteer1: string | null; // 志愿1
    volunteer2: string | null; // 志愿2
    volunteer3: string | null; // 志愿3
    volunteer4: string | null; // 志愿4
    volunteer5: string | null; // 志愿5
    volunteer6: string | null; // 志愿6
    studentFrom: string | null; // 生源地
    isAdjusted: boolean; // 是否调剂
    receiver: string | null; // 收件人
    receiverPhone: string | null; // 联系电话
    postalCode: string | null; // 邮政编码

    // 户口信息
    householdRegistration: string | null; // 户籍所在地
    householdType: string | null; // 户口类型
    address: string | null; // 通讯地址
    fatherName: string | null; // 父亲姓名
    fatherPhone: string | null; // 父亲联系方式
    fatherOccupation: string | null; // 父亲职业
    motherName: string | null; // 母亲姓名
    motherPhone: string | null; // 母亲联系方式
    motherOccupation: string | null; // 母亲职业
    guardian: string | null; // 监护人姓名
    guardianPhone: string | null; // 监护人联系方式
    familyPopulation: string | null; // 家庭人口
    familyMembers: string | null; // 家庭成员
    familyLocation: string | null; // 家庭所在地
    isOnlyChild: boolean; // 是否独生子女

    // 中学信息
    highSchoolCode: string | null; // 中学代码
    highSchoolName: string | null; // 中学名称
    candidateCategoryClassification: string | null; // 考生类别分类
    graduationCategoryClassification: string | null; // 毕业类别分类
    graduationCategory: string | null; // 毕业类别
    candidateCategory: string | null; // 考生类别
    foreignLanguage: string | null; // 外语语种
    scoreChinese: string | null; // 语文成绩
    scoreMath: string | null; // 数学成绩
    scoreForeignLanguage: string | null; // 外语成绩
    scoreComprehensive: string | null; // 综合成绩
    scorePhysics: string | null; // 物理成绩
    scoreChemistry: string | null; // 化学成绩
    scoreBiology: string | null; // 生物成绩
    scorePolitics: string | null; // 政治成绩
    scoreHistory: string | null; // 历史成绩
    scoreGeography: string | null; // 地理成绩
    scoreTechnology: string | null; // 技术成绩
    selectedSubjects: string | null; // 选考科目

    // 其他
    studentLoans: boolean; // 是否申请助学贷款
    disability: boolean; // 是否残疾
    religiousBeliefs: string | null; // 宗教信仰

    // 备注
    otherNotes: string | null; // 备注

    // 启用状态
    enabled: boolean; // 是否启用
}


export interface EnrollmentItem {
    enrollmentId: string; // 主键

    /** 个人基础信息 */
    studentId: string;     // 学号
    idNumber: string;      // 身份证号
    name: string;          // 姓名
    gender: string;        // 性别
    birthdate: string;     // 生日 (yyyy-MM-dd)
    hobbies: string;       // 个人兴趣爱好特长
    nativePlace: string;     // 籍贯
    nation: string;        // 民族
    height: string;        // 身高
    weight: string;        // 体重
    politicId: string;     // 政治面貌id
    politicStatus: string; // 政治面貌
    phone: string;         // 联系手机
    email: string;         // 邮箱

    /** 在校信息 */
    headerTeacherUsername: string; // 班主任工号
    headerTeacherRealName: string; // 班主任姓名
    headerTeacherPhone: string;    // 班主任联系方式
    dormitory: string;     // 宿舍号
    classNo: string;       // 班级
    majorId: string;       // 专业id
    majorName: string;     // 专业名
    degreeId: string;      // 培养层次id
    degreeName: string;    // 培养层次名
    gradeId: string;       // 年级id
    gradeName: string;     // 年级名

    /** 高考信息 */
    studentType: string;   // 类型
    admissionBatch: string; // 批次
    subjectCategory: string; // 科类
    provinceName: string;  // 省份名称
    examId: string;        // 考生号
    admittedMajor: string; // 录取专业
    volunteerMajor: string; // 投档志愿
    volunteerCollege: string; // 投档单位
    totalExamScore: string;  // 高考总分
    convertedScore: string;  // 总分
    specialScore: string;    // 特征成绩
    feature: string;         // 考生特征
    volunteer1: string;      // 志愿1
    volunteer2: string;      // 志愿2
    volunteer3: string;      // 志愿3
    volunteer4: string;      // 志愿4
    volunteer5: string;      // 志愿5
    volunteer6: string;      // 志愿6
    studentFrom: string;     // 生源地
    isAdjusted: boolean;     // 是否调剂
    receiver: string;        // 收件人
    receiverPhone: string;   // 联系电话
    postalCode: string;      // 邮政编码

    /** 户口信息 */
    householdRegistration: string; // 户籍所在地
    householdType: string;   // 户口类型
    address: string;         // 地址
    fatherName: string;      // 父亲姓名
    fatherPhone: string;     // 父亲联系方式
    fatherOccupation: string; // 父亲职业
    motherName: string;      // 母亲姓名
    motherPhone: string;     // 母亲联系方式
    motherOccupation: string; // 母亲职业
    guardian: string;        // 监护人姓名
    guardianPhone: string;   // 监护人联系方式
    familyPopulation: string; // 家庭人口
    familyMembers: string;   // 家庭成员
    familyLocation: string;  // 家庭所在地
    isOnlyChild: boolean;    // 是否独生子女

    /** 中学信息 */
    highSchoolCode: string;  // 中学代码
    highSchoolName: string;  // 中学名称
    candidateCategoryClassification: string; // 考生类别分类
    graduationCategoryClassification: string; // 毕业类别分类
    graduationCategory: string; // 毕业类别
    candidateCategory: string; // 考生类别
    foreignLanguage: string;  // 高考外语语种
    scoreChinese: string;        // 语文
    scoreMath: string;           // 数学
    scoreForeignLanguage: string; // 外语
    scoreComprehensive: string;  // 综合
    scorePhysics: string;        // 物理
    scoreChemistry: string;      // 化学
    scoreBiology: string;        // 生物
    scorePolitics: string;       // 政治
    scoreHistory: string;        // 历史
    scoreGeography: string;      // 地理
    scoreTechnology: string;     // 技术
    selectedSubjects: string;    // 选考科目

    /** 其他 */
    studentLoans: boolean;    // 助学贷款
    disability: boolean;      // 残疾
    religiousBeliefs: string; // 宗教信仰
    /** 备注 */
    otherNotes: string; // 备注
    /** 启用状态 */
    enabled: boolean;
}

