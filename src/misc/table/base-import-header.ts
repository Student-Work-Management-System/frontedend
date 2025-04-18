import { type TableHeader } from '.'
import type { Enrollment } from "@/model/enrollmentModel"

export interface EnrollmentHeader extends Enrollment {
  [key: string]: any,
  isAdujustText: string,
  isOnlyChildText: string,
  studentLoansText: string,
  disabilityText: string
}

export const enrollmentHeaders: TableHeader[] = [
  /** 个人基础信息 */
  {
    type: 'string',
    field: 'studentId',
    label: '学号',
    require: true,
    options: null,
    validate: (content) => (content === '' ? '学号不能为空！' : '')
  },
  {
    type: 'string',
    field: 'idNumber',
    label: '身份证号',
    require: true,
    options: null,
    validate: (content) => {
      if (content === '') return '身份证号不能为空！';
      if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(content))
        return '身份证格式错误！';
      return '';
    }
  },
  {
    type: 'string',
    field: 'name',
    label: '姓名',
    require: true,
    options: null,
    validate: (content) => (content === '' ? '姓名不能为空！' : '')
  },
  {
    type: 'select',
    field: 'gender',
    label: '性别',
    require: true,
    options: ['男', '女'],
    validate: (content) => (content === '' ? '性别不能为空！' : '')
  },
  {
    type: 'date',
    field: 'birthdate',
    label: '生日',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'hobbies',
    label: '个人兴趣爱好特长',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'nativePlace',
    label: '籍贯',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'nation',
    label: '民族',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'height',
    label: '身高(cm)',
    require: false,
    options: null,
  },
  {
    type: 'string',
    field: 'weight',
    label: '体重(kg)',
    require: false,
    options: null,
  },
  {
    type: 'select',
    field: 'politicStatus',
    label: '政治面貌',
    require: true,
    options: []
  },
  {
    type: 'string',
    field: 'phone',
    label: '手机号',
    require: true,
    options: null,
    validate: (content) =>
      content === ''
        ? '手机号不能为空！'
        : !/^1[3-9]\d{9}$/.test(content)
          ? '手机号格式错误！'
          : ''
  },
  {
    type: 'string',
    field: 'email',
    label: '邮箱',
    require: true,
    options: null,
    validate: (content) =>
      content === ''
        ? '邮箱不能为空！'
        : !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(content)
          ? '邮箱格式错误！'
          : ''
  },
  // 在校信息
  {
    type: 'select',
    field: 'headerTeacherUsername',
    label: '班主任工号',
    require: true,
    options: []
  },
  {
    type: 'string',
    field: 'dormitory',
    label: '宿舍',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'classNo',
    label: '班级',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'majorName',
    label: '专业',
    require: true,
    options: []
  },
  {
    type: 'select',
    field: 'gradeName',
    label: '年级',
    require: true,
    options: []
  },
  {
    type: 'select',
    field: 'degreeName',
    label: '培养层次',
    require: true,
    options: []
  },
  // 高考信息
  {
    type: 'string',
    field: 'studentType',
    label: '学生类型',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'admissionBatch',
    label: '录取批次',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'subjectCategory',
    label: '科类',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'provinceName',
    label: '省份名称',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'examId',
    label: '考生号',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'admittedMajor',
    label: '录取专业',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'volunteerMajor',
    label: '投档志愿',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'volunteerCollege',
    label: '投档单位',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'totalExamScore',
    label: '高考总分',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'convertedScore',
    label: '总分（折算后）',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'specialScore',
    label: '特征成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'feature',
    label: '考生特征',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'volunteer1',
    label: '志愿1',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'volunteer2',
    label: '志愿2',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'volunteer3',
    label: '志愿3',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'volunteer4',
    label: '志愿4',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'volunteer5',
    label: '志愿5',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'volunteer6',
    label: '志愿6',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'studentFrom',
    label: '生源地',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'isAdjustedText',
    label: '是否调剂',
    require: false,
    options: ['是', '否']
  },
  {
    type: 'string',
    field: 'receiver',
    label: '收件人',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'receiverPhone',
    label: '联系电话',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'postalCode',
    label: '邮政编码',
    require: false,
    options: null
  },
  // 户口信息
  {
    type: 'string',
    field: 'householdRegistration',
    label: '户籍所在地',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'householdType',
    label: '户口类型',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'address',
    label: '通讯地址',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'fatherName',
    label: '父亲姓名',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'fatherPhone',
    label: '父亲联系方式',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'fatherOccupation',
    label: '父亲职业',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'motherName',
    label: '母亲姓名',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'motherPhone',
    label: '母亲联系方式',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'motherOccupation',
    label: '母亲职业',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'guardian',
    label: '监护人姓名',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'guardianPhone',
    label: '监护人联系方式',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'familyPopulation',
    label: '家庭人口',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'familyMembers',
    label: '家庭成员',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'familyLocation',
    label: '家庭所在地',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'isOnlyChildText',
    label: '是否独生子女',
    require: false,
    options: ['是', '否']
  },
  {
    type: 'string',
    field: 'highSchoolCode',
    label: '中学代码',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'highSchoolName',
    label: '中学名称',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'candidateCategoryClassification',
    label: '考生类别分类',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'graduationCategoryClassification',
    label: '毕业类别分类',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'graduationCategory',
    label: '毕业类别',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'candidateCategory',
    label: '考生类别',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'foreignLanguage',
    label: '外语语种',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreChinese',
    label: '语文成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreMath',
    label: '数学成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreForeignLanguage',
    label: '外语成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreComprehensive',
    label: '综合成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scorePhysics',
    label: '物理成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreChemistry',
    label: '化学成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreBiology',
    label: '生物成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scorePolitics',
    label: '政治成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreHistory',
    label: '历史成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreGeography',
    label: '地理成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'scoreTechnology',
    label: '技术成绩',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'selectedSubjects',
    label: '选考科目',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'studentLoansText',
    label: '是否申请助学贷款',
    require: false,
    options: ['是', '否']
  },
  {
    type: 'select',
    field: 'disabilityText',
    label: '是否残疾',
    require: false,
    options: ['是', '否']
  },
  {
    type: 'string',
    field: 'religiousBeliefs',
    label: '宗教信仰',
    require: false,
    options: null
  },
  // 备注
  {
    type: 'string',
    field: 'otherNotes',
    label: '备注',
    require: false,
    options: null
  }
]

export const enrollmentTableHeaders = [
  /** 个人基础信息 */
  {
    label: '身份证号',
    key: 'idNumber',
    align: "center",
    showOverflowTooltip: true,
    width: 200
  },
  {
    label: '性别',
    key: 'gender',
    align: "center",
    showOverflowTooltip: false,
    width: 50
  },
  {
    label: '生日',
    key: 'birthdate',
    align: "center",
    showOverflowTooltip: false,
    width: 125
  },
  {
    label: '籍贯',
    key: 'nativePlace',
    align: "center",
    showOverflowTooltip: false,
    width: 175
  },
  {
    label: '民族',
    key: 'nation',
    align: "center",
    showOverflowTooltip: false,
    width: 100
  },
  {
    label: '身高(cm)',
    key: 'height',
    align: "center",
    showOverflowTooltip: false,
    width: 100
  },
  {
    label: '体重(kg)',
    key: 'weight',
    align: "center",
    showOverflowTooltip: false,
    width: 100
  },
  {
    label: '政治面貌',
    key: 'politicStatus',
    align: "center",
    showOverflowTooltip: false,
    width: 125
  },
  {
    label: '手机号',
    key: 'phone',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: "邮箱",
    key: "email",
    align: "center",
    showOverflowTooltip: true,
    width: 200
  },
  /** 在校信息 */
  {
    label: '班主任姓名',
    key: 'headerTeacherRealName',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '班主任联系方式',
    key: 'headerTeacherPhone',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '宿舍',
    key: 'dormitory',
    align: "center",
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '班级',
    key: 'classNo',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '年级',
    key: 'gradeName',
    align: "center",
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '培养层次',
    key: 'degreeName',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '专业',
    key: 'majorName',
    align: "center",
    showOverflowTooltip: false,
    width: 150
  },
  /** 高考信息 */

  {
    label: '类型',
    key: 'studentType',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '批次',
    key: 'admissionBatch',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '科类',
    key: 'subjectCategory',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '省份名称',
    key: 'provinceName',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '考生号',
    key: 'examId',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '录取专业',
    key: 'admittedMajor',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '投档志愿',
    key: 'volunteerMajor',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '投档单位',
    key: 'volunteerCollege',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '高考总分',
    key: 'totalExamScore',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '折算总分',
    key: 'convertedScore',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '特征成绩',
    key: 'specialScore',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '考生特征',
    key: 'feature',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '志愿1',
    key: 'volunteer1',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '志愿2',
    key: 'volunteer2',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '志愿3',
    key: 'volunteer3',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '志愿4',
    key: 'volunteer4',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '志愿5',
    key: 'volunteer5',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '志愿6',
    key: 'volunteer6',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '生源地',
    key: 'studentFrom',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '是否调剂',
    key: 'isAdjusted',
    align: 'center',
    showOverflowTooltip: false,
    formatter: (_row: any, _column: any, cellValue: boolean) => cellValue ? '是' : '否',
    width: 150
  },
  {
    label: '收件人姓名',
    key: 'receiver',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '收件人联系电话',
    key: 'receiverPhone',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '邮政编码',
    key: 'postalCode',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  /** 户口信息  */
  {
    label: '户籍所在地',
    key: 'householdRegistration',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '户口类型',
    key: 'householdType',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '地址',
    key: 'address',
    align: 'center',
    showOverflowTooltip: false,
    width: 225
  },
  {
    label: '父亲姓名',
    key: 'fatherName',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '父亲联系方式',
    key: 'fatherPhone',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '父亲职业',
    key: 'fatherOccupation',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '母亲姓名',
    key: 'motherName',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '母亲联系方式',
    key: 'motherPhone',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '母亲职业',
    key: 'motherOccupation',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '监护人姓名',
    key: 'guardian',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '监护人联系方式',
    key: 'guardianPhone',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '家庭人口',
    key: 'familyPopulation',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '家庭成员',
    key: 'familyMembers',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '家庭所在地',
    key: 'familyLocation',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '是否独生子女',
    key: 'isOnlyChild',
    align: 'center',
    showOverflowTooltip: false,
    formatter: (_row: any, _column: any, cellValue: boolean) => cellValue ? '是' : '否',
    width: 150
  },
  /** 中学信息 */

  {
    label: '高中代码',
    key: 'highSchoolCode',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '高中名称',
    key: 'highSchoolName',
    align: 'center',
    showOverflowTooltip: false,
    width: 200
  },
  {
    label: '考生类别分类',
    key: 'candidateCategoryClassification',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '毕业类别分类',
    key: 'graduationCategoryClassification',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '毕业类别',
    key: 'graduationCategory',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '考生类别',
    key: 'candidateCategory',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '高考外语语种',
    key: 'foreignLanguage',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '语文',
    key: 'scoreChinese',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '数学',
    key: 'scoreMath',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '外语',
    key: 'scoreForeignLanguage',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '综合',
    key: 'scoreComprehensive',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '物理',
    key: 'scorePhysics',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '化学',
    key: 'scoreChemistry',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '生物',
    key: 'scoreBiology',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '政治',
    key: 'scorePolitics',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '历史',
    key: 'scoreHistory',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '地理',
    key: 'scoreGeography',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '技术',
    key: 'scoreTechnology',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  {
    label: '选考科目',
    key: 'selectedSubjects',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
  /** 其他 */
  {
    label: '助学贷款',
    key: 'studentLoans',
    align: 'center',
    showOverflowTooltip: false,
    formatter: (_row: any, _column: any, cellValue: boolean) => cellValue ? '是' : '否',
    width: 150
  },
  {
    label: '残疾',
    key: 'disability',
    align: 'center',
    showOverflowTooltip: false,
    formatter: (_row: any, _column: any, cellValue: boolean) => cellValue ? '是' : '否',
    width: 150
  },
  {
    label: '宗教信仰',
    key: 'religiousBeliefs',
    align: 'center',
    showOverflowTooltip: false,
    width: 150
  },
]