export interface Student {
    // 学号
    studentId: string | null
    // 学生的身份证号
    idNumber: string | null
    // 姓名
    name: string | null
    // 性别（仅限 "男" 或 "女"）
    gender: string | null
    // 籍贯
    nativePlace: string | null
    // 邮政编码
    postalCode: string | null
    // 手机号
    phone: string | null
    // 邮箱
    email: string | null
    // 民族
    nation: string | null
    // 专业ID
    majorId: string | null
    // 专业姓名
    majorName: string | null
    // 年级（4位数字）
    grade: string | null
    // 班号
    classNo: string | null
    // 班主任工号
    headTeacherUsername: string | null
    headTeacherName: string | null
    headTeacherPhone: string | null
    // 政治面貌
    politicsStatus: string | null
    // 是否共青团员
    isCommunistYouthLeagueMember: boolean | null
    // 入团时间
    joiningTime: string | null
    // 是否助学贷款
    isStudentLoans: boolean | null
    // 身高(cm)
    height: string | null
    // 体重(kg)
    weight: string | null
    // 宗教信仰
    religiousBeliefs: string | null
    // 家庭所在省/市/区
    location: string | null
    // 家庭人口
    familyPopulation: string | null
    // 是否独生子女
    isOnlyChild: boolean | null
    // 家庭成员
    familyMembers: string | null
    // 出生日期
    birthdate: string | null
    // 户籍所在地
    householdRegistration: string | null
    // 户口类型
    householdType: string | null
    // 家庭住址
    address: string | null
    // 父亲姓名
    fatherName: string | null
    // 父亲联系方式
    fatherPhone: string | null
    // 父亲职业
    fatherOccupation: string | null
    // 母亲姓名
    motherName: string | null
    // 母亲联系方式
    motherPhone: string | null
    // 母亲职业
    motherOccupation: string | null
    // 监护人姓名
    guardian: string | null
    // 监护人联系方式
    guardianPhone: string | null
    // 中学名称
    highSchool: string | null
    // 考生号
    examId: string | null
    // 录取批次
    admissionBatch: string | null
    // 高考总分
    totalExamScore: string | null
    // 外语语种
    foreignLanguage: string | null
    // 外语分数
    foreignScore: string | null
    // 个人兴趣爱好特长
    hobbies: string | null
    // 宿舍
    dormitory: string | null
    // 备注
    otherNotes: string | null
    // 是否启用
    enabled: boolean
}
export interface StudentQuery {
    // 学号、姓名、身份证、邮箱、手机号、父母姓名、父母手机号、监护人姓名、监护人电话
    search: string
    // 性别
    gender: string | null
    // 籍贯
    nativePlace: string | null
    // 专业id
    majorId: string | null
    // 年级
    grade: string | null
    // 民族
    nation: string | null
    // 政治面貌
    politicsStatus: string | null
    // 是否共青团员
    isCommunistYouthLeagueMember: boolean | null
    // 入团时间
    joiningTime: string | null
    // 是否助学贷款
    isStudentLoans: boolean | null
    // 身高(cm)
    height: string | null
    // 体重(kg)
    weight: string | null
    // 宗教信仰
    religiousBeliefs: string | null
    // 家庭所在省/市/区
    location: string | null
    // 家庭人口
    familyPopulation: string | null
    // 是否独生子女
    isOnlyChild: boolean | null
    // 家庭成员
    familyMembers: string | null
    // 邮政编码
    postalCode: string | null
    // 班号
    classNo: string | null
    // 宿舍
    dormitory: string | null
    // 出生日期
    birthdate: string | null
    // 户籍所在地
    householdRegistration: string | null
    // 户口类型
    householdType: string | null
    // 家庭住址
    address: string | null
    // 高中名称
    highSchool: string | null
    // 考生号
    examId: string | null
    // 录取批次
    admissionBatch: string | null
    // 高考总分
    totalExamScore: string | null
    // 外语语种
    foreignLanguage: string | null
    // 外语分数
    foreignScore: string | null
    // 个人兴趣爱好特长
    hobbies: string | null
    // 其他标签备注
    otherNotes: string | null
    // 是否启用
    enabled: boolean
    // 分页参数
    pageNo: number
    pageSize: number
}