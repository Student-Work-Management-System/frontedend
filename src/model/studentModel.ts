export interface Student {
    // 学号
    studentId: string
    // 学生的身份证号
    idNumber: string
    // 姓名
    name: string
    // 性别（仅限 "男" 或 "女"）
    gender: string
    // 籍贯
    nativePlace: string
    // 邮政编码
    postalCode: string
    // 手机号
    phone: string
    // 邮箱
    email: string
    // 民族
    nation: string
    // 专业ID
    majorId: string
    // 专业姓名
    majorName: string
    // 年级（4位数字）
    grade: string
    // 班号
    classNo: string
    // 班主任工号
    headTeacherUsername: string
    headTeacherName: string
    headTeacherPhone: string
    // 政治面貌
    politicsStatus: string
    // 出生日期
    birthdate: string // 采用字符串存储 "yyyy-MM-dd" 格式
    // 户籍所在地
    householdRegistration: string
    // 户口类型
    householdType: string
    // 家庭住址
    address: string
    // 父亲姓名
    fatherName: string
    // 父亲联系方式
    fatherPhone: string
    // 父亲职业
    fatherOccupation: string
    // 母亲姓名
    motherName: string
    // 母亲联系方式
    motherPhone: string
    // 母亲职业
    motherOccupation: string
    // 监护人姓名
    guardian: string
    // 监护人联系方式
    guardianPhone: string
    // 中学名称
    highSchool: string
    // 考生号
    examId: string
    // 录取批次
    admissionBatch: string
    // 高考总分
    totalExamScore: string
    // 外语语种
    foreignLanguage: string
    // 外语分数
    foreignScore: string
    // 个人兴趣爱好特长
    hobbies: string
    // 宿舍
    dormitory: string
    // 备注
    otherNotes: string
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