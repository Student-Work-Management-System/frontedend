<script lang="ts" setup>
import { ref } from 'vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import EditStudentCadreForm from '@/components/home/cadre/EditStudentCadre.vue'
import SemesterSelect from '@/components/home/cadre/SemesterSelect.vue'

import {
  apiGetStudentCadreList,
  apiDeleteStudentCadre,
  getCadreLevers,
  type StudentCadreRecord
} from '@/api/cadre'

import { useUserStore } from '@/stores/user'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { reactive } from 'vue'

const headers = [
  {
    title: '学号',
    align: 'start',
    sortable: true,
    key: 'studentId'
  },
  {
    title: '姓名',
    align: 'start',
    sortable: false,
    key: 'name'
  },
  {
    title: '性别',
    align: 'start',
    sortable: false,
    key: 'gender'
  },
  {
    title: '专业',
    align: 'start',
    sortable: false,
    key: 'majorName'
  },
  {
    title: '年级',
    align: 'start',
    sortable: true,
    key: 'grade'
  },
  {
    title: '具体职位',
    align: 'start',
    sortable: true,
    key: 'cadrePosition'
  },
  {
    title: '职位级别',
    align: 'start',
    sortable: false,
    key: 'cadreLevel'
  },
  {
    title: '任职开始学期',
    align: 'start',
    sortable: false,
    key: 'appointmentStartTerm'
  },
  {
    title: '任职结束学期',
    align: 'start',
    sortable: false,
    key: 'appointmentEndTerm'
  },
  {
    title: '备注',
    align: 'start',
    sortable: false,
    key: 'comment'
  },
  {
    title: '操作',
    align: 'start',
    sortable: false,
    key: 'operations'
  }
]

const loading = ref(false)
const selected = ref<any[]>([])
const data = ref<StudentCadreRecord[]>([])
const CadreLevels = ref<String[]>(getCadreLevers())
const dataLength = ref<number>(0)
const deleteDialog = ref(false)
const editStudentCadreFormDialog = ref(false)

const query = reactive({
  search: null,
  majorId: null,
  grade: null,
  cadreLevel: null,
  appointmentStartTerm: null,
  appointmentEndTerm: null,
  pageNo: 1,
  pageSize: 10
})
const store = useUserStore()
const editInfo = ref<StudentCadreRecord>({
  studentCadreId: '',
  studentId: '',
  cadreId: '',
  name: '',
  gender: '',
  majorName: '',
  grade: '',
  cadrePosition: '',
  cadreLevel: '',
  appointmentStartTerm: '',
  appointmentEndTerm: '',
  comment: ''
})
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const fetchStudentCadreLogic = async () => {
  loading.value = true
  if (query.pageSize === -1) query.pageSize = 9999

  const { data: result } = await apiGetStudentCadreList(query)

  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    deleteDialog.value = false
    return
  }

  data.value = result.data.records
  dataLength.value = result.data.totalRow
  deleteDialog.value = false
  loading.value = false
}
onMounted(fetchStudentCadreLogic)

const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchStudentCadreLogic()
}

const deleteStudentCadreLogic = async () => {
  loading.value = true
  const studentIds = selected.value.map((v) => v.studentCadreId)
  studentIds.forEach(async (id) => {
    const { data: result } = await apiDeleteStudentCadre(id)
    if (result.code !== 200) {
      console.error(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
  })
  setTimeout(() => {
    notify({ type: 'success', title: '成功', text: `删除成功！` })
    deleteDialog.value = false
    loading.value = false
    fetchStudentCadreLogic()
  }, 500)
}
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <EditStudentCadreForm
      v-model="editStudentCadreFormDialog"
      :info="editInfo"
      @on-closed="
        () => {
          editStudentCadreFormDialog = false
          fetchStudentCadreLogic()
        }
      "
    />

    <v-dialog width="500" v-model="deleteDialog">
      <v-card
        prepend-icon="mdi-delete"
        title="删除选择"
        :text="`已选择 ${selected.length} 条记录，本操作不可撤回，确定要删除吗？`"
      >
        <v-card-actions class="mx-auto">
          <v-btn
            :loading="loading"
            :disabled="selected.length === 0"
            color="error"
            @click="deleteStudentCadreLogic"
            >删除</v-btn
          >
          <v-btn @click="deleteDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <section class="menu">
      <span class="w-10">
        <MajorSelect v-model="query.majorId" variant="underlined" />
      </span>
      <span class="w-10">
        <GradeSelect v-model="query.grade" variant="underlined" />
      </span>
      <span class="w-10">
        <v-select
          label="职位等级"
          v-model="query.cadreLevel"
          :items="CadreLevels"
          class="text-indigo"
          color="indigo"
          hide-details
          clearable
          variant="underlined"
        >
        </v-select>
      </span>
      <span class="w-10 text-indigo">
        <SemesterSelect
          v-model="query.appointmentStartTerm"
          color="'indigo'"
          :label="'任职开始学期'"
          variant="underlined"
        />
      </span>
      <span class="w-10 text-indigo">
        <SemesterSelect
          v-model="query.appointmentEndTerm"
          :color="'indigo'"
          :label="'任职结束学期'"
          variant="underlined"
        />
      </span>

      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchStudentCadreLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
        >
          <v-tooltip activator="parent" location="top">以学号/姓名/职位名称搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="
          has('student:select') &&
          has('student_cadre:select') &&
          has('cadre:select') &&
          has('major:select')
        "
        @click="fetchStudentCadreLogic"
        >刷新</v-btn
      >

      <v-btn prepend-icon="mdi-delete" color="error" @click="deleteDialog = true">删除</v-btn>
    </section>

    <section class="pa-4 h-100 w-100">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :headers="headers"
          :items="data"
          :items-length="dataLength"
          :loading="loading"
          v-model:page="query.pageNo"
          v-model:items-per-page="query.pageSize"
          @update:options="loadItems"
          show-select
          return-object
        >
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn prepend-icon="mdi-pencil" color="indigo" @click="() => {
                editInfo = JSON.parse(JSON.stringify(item))
                editStudentCadreFormDialog = true
              }
                ">编辑</v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card>
    </section>
  </v-card>
</template>

<style scoped >
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}
.menu > * {
  margin-right: 0.5rem;
}
.w-10 {
  width: 10% !important;
}
.w-15 {
  width: 15% !important;
}
</style>
