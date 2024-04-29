<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import {
  apiGetPovertyAssistanceList,
  apiDeletePovertyAssistance,
  type PovertyAssistance
} from '@/api/poverty'
import { notify } from '@kyvg/vue3-notification'
import AddPovertyForm from '@/components/home/poverty/AddPovertyForm.vue'
import EditPovertyForm from '@/components/home/poverty/EditPovertyForm.vue'
import { useUserStore } from '@/stores/user'

const headers = [
  {
    title: '贫困类型ID',
    align: 'start',
    sortable: true,
    key: 'povertyAssistanceId'
  },
  {
    title: '贫困类型',
    align: 'start',
    sortable: false,
    key: 'povertyType'
  },
  {
    title: '贫困等级',
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
    title: '操作',
    align: 'center',
    sortable: false,
    key: 'operations'
  }
]

const selected = ref<PovertyAssistance[]>([])
const loading = ref(true)
const data = ref<any>([])
const addPovertyFormDialog = ref(false)
const selectPermissionDialog = ref(false)
const deleteDialog = ref(false)
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const editPovertyInfoFormDialog = ref(false)
const editInfo = ref<PovertyAssistance>({
povertyAssistanceId: '',
  povertyLevel: '',
  povertyType: '',
  povertyAssistanceStandard: ''
})

const fetchPovertyLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetPovertyAssistanceList()
  if (result.code !== 200) {
    console.log(result.message)
    notify({ title: '错误', text: result.message, type: 'error' })
    return
  }
  data.value = result.data
  loading.value = false
}

const afterPoverty = () => {
  addPovertyFormDialog.value = false
  selectPermissionDialog.value = false
  editPovertyInfoFormDialog.value = false
  deleteDialog.value = false
  selected.value = []
  fetchPovertyLogic()
}

const deletePovertyLogic = async () => {
  loading.value = true
  selected.value.forEach(async (p) => {
    const povertyAssistanceId = p.povertyAssistanceId
    const { data: result } = await apiDeletePovertyAssistance(povertyAssistanceId)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    
  })
  setTimeout(() => {
    notify({ type: 'success', title: '成功', text: `删除成功！` })
    afterPoverty()
    loading.value = false
  }, 500)
}

onMounted(fetchPovertyLogic)
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <AddPovertyForm v-model="addPovertyFormDialog" @on-closed="afterPoverty" />
    <EditPovertyForm
      v-model="editPovertyInfoFormDialog"
      :info="editInfo"
      @on-closed="afterPoverty"
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
            @click="deletePovertyLogic"
            >删除</v-btn
          >
          <v-btn @click="deleteDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <section class="menu">
      <v-btn v-if="has('poverty_assistance:select')" prepend-icon="mdi-refresh" @click="fetchPovertyLogic"
        >刷新</v-btn
      >
      <v-btn
        v-if="has('poverty_assistance:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addPovertyFormDialog = true"
        >添加</v-btn
      >

      <v-btn
        v-if="has('poverty_assistance:delete')"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
        >删除</v-btn
      >
    </section>

    <section class="pa-4 d-inline-block h-100 w-100">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="data"
          :loading="loading"
          show-select
          return-object
        >
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn prepend-icon="mdi-pencil" color="indigo" @click="() => {
                editInfo = JSON.parse(JSON.stringify(item))
                editPovertyInfoFormDialog = true
              }
                ">编辑</v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </section>
  </v-card>
</template>

<style scoped>
.v-card {
  align-items: start;
}
.menu {
  padding: 1rem 1rem 0 1rem;
}
.menu > * {
  margin-right: 0.5rem;
}
</style>
