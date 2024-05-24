<script lang="ts" setup>
import { ref } from 'vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import EditStudentPovertyForm from '@/components/home/poverty/EditStudentPovertyForm.vue'
import AcademicYearSelect from '@/components/home/poverty/AcademicYearSelect.vue'

import {
  apiDeleteStudentPovertyAssistance,
  getPovertyLevels,
  apiGetStudentPovertyAssistanceList,
  type StudentPovertyAssistanceRecord
} from '@/api/poverty'

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
    title: '贫困类型',
    align: 'start',
    sortable: true,
    key: 'povertyType'
  },
  {
    title: '贫困级别',
    align: 'start',
    sortable: false,
    key: 'povertyLevel'
  },
  {
    title: '资助标准',
    align: 'start',
    sortable: false,
    key: 'povertyAssistanceStandard'
  },
  {
    title: '认证学年',
    align: 'start',
    sortable: false,
    key: 'assistanceYear'
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
const data = ref<StudentPovertyAssistanceRecord[]>([])
const povertyLevels = ref<String[]>(getPovertyLevels())
const dataLength = ref<number>(0)
const deleteDialog = ref(false)
const addStudentPovertyDialog = ref(false)
const editStudentPovertyFormDialog = ref(false)

const query = reactive({
  search: null,
  majorId: null,
  grade: null,
  povertyLevel: null,
  assistanceYear: null,
  pageNo: 1,
  pageSize: 10
})
const store = useUserStore()
const editInfo = ref<StudentPovertyAssistanceRecord>({
  studentPovertyAssistanceId: '',
  studentId: '',
  povertyAssistanceId: '',
  name: '',
  majorName: '',
  povertyLevel: '',
  povertyType: '',
  povertyAssistanceStandard: '',
  assistanceYear: ''
})
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const fetchStudentPovertyLogic = async () => {
  loading.value = true
  if (query.pageSize === -1) query.pageSize = 9999

  const { data: result } = await apiGetStudentPovertyAssistanceList(query)

  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    deleteDialog.value = false
    return
  }

  selected.value = []
  data.value = result.data.records
  dataLength.value = result.data.totalRow
  deleteDialog.value = false
  loading.value = false
  console.log(data.value);

}
onMounted(fetchStudentPovertyLogic)

const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchStudentPovertyLogic()
}

const deleteStudentPovertyLogic = async () => {
  loading.value = true
  const studentPovertyIds = selected.value.map((v) => v.studentPovertyAssistanceId)

  let reqs = studentPovertyIds.map(id => (async (id) => {
    const { data: result } = await apiDeleteStudentPovertyAssistance(id)
    if (result.code !== 200) {
      console.error(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
  })(id))
  await Promise.all(reqs)

  deleteDialog.value = false
  loading.value = false
  notify({ type: 'success', title: '成功', text: `删除成功！` })
  fetchStudentPovertyLogic()
}
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <AddStudentPovertyForm v-model="addStudentPovertyDialog" @on-closed="() => {
      addStudentPovertyDialog = false
      fetchStudentPovertyLogic()
    }
      " />
    <EditStudentPovertyForm v-model="editStudentPovertyFormDialog" :info="editInfo" @on-closed="() => {
      editStudentPovertyFormDialog = false
      fetchStudentPovertyLogic()
    }
      " />

    <v-dialog width="500" v-model="deleteDialog">
      <v-card prepend-icon="mdi-delete" title="删除选择" :text="`已选择 ${selected.length} 条记录，本操作不可撤回，确定要删除吗？`">
        <v-card-actions class="mx-auto">
          <v-btn :loading="loading" :disabled="selected.length === 0" color="error"
            @click="deleteStudentPovertyLogic">删除</v-btn>
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
        <v-select label="贫困等级" v-model="query.povertyLevel" :items="povertyLevels" class="text-indigo" color="indigo"
          hide-details clearable variant="underlined">
        </v-select>
      </span>


      <span class="w-10 text-indigo">
        <AcademicYearSelect v-model="query.assistanceYear" color="indigo" variant="underlined" />
      </span>

      <span class="w-15 text-indigo">
        <v-text-field v-model="query.search" color="indigo" @update:modelValue="fetchStudentPovertyLogic"
          :loading="loading" :counter="15" clearable label="搜索" prepend-inner-icon="mdi-magnify" variant="underlined"
          hide-details>
          <v-tooltip activator="parent" location="top">按贫困类型/资助标准搜索</v-tooltip>
        </v-text-field>

      </span>

      <v-btn prepend-icon="mdi-refresh" v-if="has('student:select') &&
        has('student_poverty_assistance:select') &&
        has('poverty_assistance:select') &&
        has('major:select')
        " @click="fetchStudentPovertyLogic">刷新</v-btn>

      <v-btn v-if="has('student_poverty_assistance:delete')" prepend-icon="mdi-delete" color="error"
        @click="deleteDialog = true">删除</v-btn>
    </section>

    <section class="pa-4 h-100 w-100">
      <v-card height="90%" style="overflow: hidden; overflow-y: auto; ">
        <v-data-table-server v-model="selected" :headers="headers" :items="data" :items-length="dataLength"
          :loading="loading" v-model:page="query.pageNo" v-model:items-per-page="query.pageSize"
          @update:options="loadItems" show-select return-object>
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn v-if="has('student_poverty_assistance:update')" prepend-icon="mdi-pencil" color="indigo" @click="() => {
                editInfo = JSON.parse(JSON.stringify(item))
                editStudentPovertyFormDialog = true
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

.menu>* {
  margin-right: 0.5rem;
}

.w-10 {
  width: 10% !important;
}

.w-15 {
  width: 15% !important;
}
</style>
