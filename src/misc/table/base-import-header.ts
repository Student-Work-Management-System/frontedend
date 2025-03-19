import { type TableHeader } from '.'
import { type Student } from '@/model/studentModel'

export interface BaseHeader extends Student {
  [key: string]: any
  isOnlyChildText: string
  isStudentLoansText: string
  disabilityText: string
}

export const tableHeaders = [
  // 基本信息
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
    label: '民族',
    key: 'nation',
    align: "center",
    showOverflowTooltip: false,
    width: 100
  },
  {
    label: '生日',
    key: 'birthdate',
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

  // 身体信息
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

  // 学校信息
  {
    label: '年级',
    key: 'gradeName',
    align: "center",
    showOverflowTooltip: false,
    width: 75
  },
  {
    label: '专业',
    key: 'majorName',
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
    label: '宿舍',
    key: 'dormitory',
    align: "center",
    showOverflowTooltip: false,
    width: 150
  },
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
  // 政治信息
  {
    label: '政治面貌',
    key: 'politicStatus',
    align: "center",
    showOverflowTooltip: false,
    width: 125
  },
  {
    label: '入团时间',
    key: 'joiningTime',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },

  // 家庭基本信息
  {
    label: '家庭所在省/市/区',
    key: 'location',
    align: "center",
    showOverflowTooltip: true,
    width: 150
  },
  {
    label: '家庭住址',
    key: 'address',
    align: "center",
    showOverflowTooltip: true,
    width: 200
  },
  {
    label: '籍贯',
    key: 'nativePlace',
    align: "center",
    showOverflowTooltip: true,
    width: 125
  },
  {
    label: '户籍所在地',
    key: 'householdRegistration',
    align: "center",
    showOverflowTooltip: true,
    width: 150
  },
  {
    label: '户口类型',
    key: 'householdType',
    align: "center",
    showOverflowTooltip: true,
    width: 125
  },
  {
    label: '邮政编码',
    key: 'postalCode',
    align: "center",
    showOverflowTooltip: false,
    width: 100
  },
  {
    label: '家庭人口',
    key: 'familyPopulation',
    align: "center",
    showOverflowTooltip: false,
    width: 100
  },
  {
    label: '家庭成员',
    key: 'familyMembers',
    align: "center",
    showOverflowTooltip: true,
    width: 200
  },

  // 父母信息
  {
    label: '父亲姓名',
    key: 'fatherName',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '父亲联系方式',
    key: 'fatherPhone',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '父亲职业',
    key: 'fatherOccupation',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '母亲姓名',
    key: 'motherName',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '母亲联系方式',
    key: 'motherPhone',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '母亲职业',
    key: 'motherOccupation',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },

  // 监护人信息
  {
    label: '监护人姓名',
    key: 'guardian',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '监护人联系方式',
    key: 'guardianPhone',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },

  // 入学信息
  {
    label: '中学名称',
    key: 'highSchool',
    align: "center",
    showOverflowTooltip: true,
    width: 200
  },
  {
    label: '考生号',
    key: 'examId',
    align: "center",
    showOverflowTooltip: true,
    width: 200
  },
  {
    label: '录取批次',
    key: 'admissionBatch',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '高考总分',
    key: 'totalExamScore',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '外语语种',
    key: 'foreignLanguage',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },
  {
    label: '外语分数',
    key: 'foreignScore',
    align: "center",
    showOverflowTooltip: false,
    width: 120
  },

  // 其他信息
  {
    label: '宗教信仰',
    key: 'religiousBeliefs',
    align: "center",
    showOverflowTooltip: true,
    width: 120
  },
  {
    label: '个人兴趣爱好特长',
    key: 'hobbies',
    align: "center",
    showOverflowTooltip: true,
    width: 200
  },
]

export const baseheaders: TableHeader[] = [
  // 基本信息
  {
    type: 'string',
    field: 'studentId',
    label: '学号',
    require: true,
    options: null,
    validate: (content) => (content === '' ? '学号不能为空！' : '')
  },
  {
    type: 'select',
    field: 'degreeName',
    label: '学历层次',
    require: true,
    options: []
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
    type: 'string',
    field: 'nation',
    label: '民族',
    require: false,
    options: null
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

  // 身体信息
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

  // 学校信息
  {
    type: 'select',
    field: 'gradeName',
    label: '年级',
    require: true,
    options: []
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
    field: 'statusName',
    label: '学籍状态',
    require: true,
    options: []
  },
  {
    type: 'string',
    field: 'classNo',
    label: '班级',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'dormitory',
    label: '宿舍',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'headerTeacherUsername',
    label: '班主任工号',
    require: true,
    options: []
  },
  // 政治信息
  {
    type: 'select',
    field: 'politicStatus',
    label: '政治面貌',
    require: true,
    options: []
  },
  {
    type: 'date',
    field: 'joiningTime',
    label: '入团时间',
    require: false,
    options: null
  },

  // 家庭基本信息
  {
    type: 'string',
    field: 'location',
    label: '家庭所在省/市/区',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'address',
    label: '家庭住址',
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
    field: 'postalCode',
    label: '邮政编码',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'familyPopulation',
    label: '家庭人口',
    require: false,
    options: null,
  },
  {
    type: 'string',
    field: 'familyMembers',
    label: '家庭成员',
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
  // 父母信息
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
    options: null,
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
    options: null,
  },
  {
    type: 'string',
    field: 'motherOccupation',
    label: '母亲职业',
    require: false,
    options: null
  },

  // 监护人信息
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
    options: null,
  },

  // 入学信息
  {
    type: 'string',
    field: 'highSchool',
    label: '中学名称',
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
    field: 'admissionBatch',
    label: '录取批次',
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
    field: 'foreignLanguage',
    label: '外语语种',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'foreignScore',
    label: '外语分数',
    require: false,
    options: null
  },

  // 其他信息
  {
    type: 'select',
    field: 'isStudentLoansText',
    label: '是否助学贷款',
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
  {
    type: 'string',
    field: 'hobbies',
    label: '个人兴趣爱好特长',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'otherNotes',
    label: '备注',
    require: false,
    options: null
  }
]
