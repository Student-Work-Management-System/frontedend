import { type TableHeader } from '.'
import { type Student } from '@/model/studentModel'
export interface BaseHeader extends Student {
  [key: string]: any
}

export const tableHeaders = [
  {
    label: '身份证号',
    key: 'idNumber',
    align: "center",
    width: 200
  },
  {
    label: '性别',
    key: 'gender',
    align: "center",
    width: 50
  },
  {
    label: '民族',
    key: 'nation',
    align: "center",
    width: 100
  },
  {
    label: '生日',
    key: 'birthdate',
    align: "center",
    width: 125
  },
  {
    label: '手机号',
    key: 'phone',
    align: "center",
    width: 120
  },
  {
    label: "邮箱",
    key: "email",
    align: "center",
    width: 200
  },
  {
    label: '年级',
    key: 'grade',
    align: "center",
    width: 75
  },
  {
    label: '专业',
    key: 'majorName',
    align: "center",
    width: 150
  },
  {
    label: '班级',
    key: 'classNo',
    align: "center",
    width: 75
  },
  {
    label: '宿舍',
    key: 'dormitory',
    align: "center",
    width: 150
  },
  {
    label: '政治面貌',
    key: 'politicsStatus',
    align: "center",
    width: 125
  },
  {
    label: '籍贯',
    key: 'nativePlace',
    align: "center",
    width: 125
  },
  {
    label: '家庭住址',
    key: 'address',
    align: "center",
    width: 200
  },
  {
    label: '户籍所在地',
    key: 'householdRegistration',
    align: "center",
    width: 150
  },
  {
    label: '户口类型',
    key: 'householdType',
    align: "center",
    width: 125
  },
  {
    label: '邮政编码',
    key: 'postalCode',
    align: "center",
    width: 100
  },
  {
    label: '班主任姓名',
    key: 'headTeacherName',
    align: "center",
    width: 120
  },
  {
    label: '班主任联系方式',
    key: 'headTeacherPhone',
    align: "center",
    width: 120
  },
  {
    label: '父亲姓名',
    key: 'fatherName',
    align: "center",
    width: 120
  },
  {
    label: '父亲联系方式',
    key: 'fatherPhone',
    align: "center",
    width: 120
  },
  {
    label: '父亲职业',
    key: 'fatherOccupation',
    align: "center",
    width: 120
  },
  {
    label: '母亲姓名',
    key: 'motherName',
    align: "center",
    width: 120
  },
  {
    label: '母亲联系方式',
    key: 'motherPhone',
    align: "center",
    width: 120
  },
  {
    label: '母亲职业',
    key: 'motherOccupation',
    align: "center",
    width: 120
  },
  {
    label: '监护人姓名',
    key: 'guardian',
    align: "center",
    width: 120
  },
  {
    label: '监护人联系方式',
    key: 'guardianPhone',
    align: "center",
    width: 120
  },
  {
    label: '中学名称',
    key: 'highSchool',
    align: "center",
    width: 200
  },
  {
    label: '考生号',
    key: 'examId',
    align: "center",
    width: 200
  },
  {
    label: '录取批次',
    key: 'admissionBatch',
    align: "center",
    width: 120
  },
  {
    label: '高考总分',
    key: 'totalExamScore',
    align: "center",
    width: 120
  },
  {
    label: '外语语种',
    key: 'foreignLanguage',
    align: "center",
    width: 120
  },
  {
    label: '外语分数',
    key: "foreignScore",
    align: "center",
    width: 120,
  }
]


export const baseheaders: TableHeader[] = [
  {
    type: 'string',
    field: 'studentId',
    label: '学号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '学号不能为空！'
      return '' // return empty string if there is no error
    }
  },
  {
    type: 'string',
    field: 'name',
    label: '姓名',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '姓名不能为空！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'idNumber',
    label: '身份证号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '身份证号不能为空！'
      if (
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(content)
      )
        return '身份证格式错误！'
      return ''
    }
  },
  {
    type: 'select',
    field: 'gender',
    label: '性别',
    require: true,
    options: ['男', '女'],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '性别不能为空！'
      if (!/^[男女]$/.test(content)) return '性别错误！'
      return ''
    }
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
    field: 'postalCode',
    label: '邮政编码',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'politicsStatus',
    label: '政治面貌',
    require: true,
    options: ['群众', '共青团员', '中共党员(预备)', '中共党员'],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '政治面貌不能为空！'
      if (!['群众', '共青团员', '中共党员(预备)', '中共党员'].includes(content)) return '政治面貌错误！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'phone',
    label: '手机号',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '手机号不能为空！'
      if (
        !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
          content
        )
      )
        return '手机号格式错误！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'email',
    label: '邮箱',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content == '') return '邮箱不能为空！'
      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(content)
      )
        return '邮箱格式错误'
      return ''
    }
  },
  {
    type: 'string',
    field: 'nation',
    label: '民族',
    require: false,
    options: null
  },
  {
    type: 'select',
    field: 'majorName',
    label: '专业名称',
    require: true,
    options: [
      '计算机科学与技术',
      '软件工程',
      '信息安全',
      '物联网工程',
      '智能科学与技术',
      '网络空间安全'
    ],
    validate: (content, oldContent, record, field) => {
      if (content === '') return '专业名称不能为空！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'grade',
    label: '年级',
    require: true,
    options: null,
    validate: (content, oldContent, record, field) => {
      if (content === '') return '年级不能为空！'
      return ''
    }
  },
  {
    type: 'string',
    field: 'classNo',
    label: '班级号',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'headTeacherName',
    label: '班主任姓名',
    require: false,
    options: null
  },
  {
    type: 'string',
    field: 'headTeacherPhone',
    label: '班主任联系方式',
    require: false,
    options: null
  }
]
