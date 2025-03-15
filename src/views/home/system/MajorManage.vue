<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { apiDeleteMajor, apiGetMajorList, type Major } from '@/api/major'
import MajorForm from '@/components/home/system/MajorForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { onMounted } from 'vue'

const headers = [
  {
    title: '专业ID',
    align: 'start',
    sortable: true,
    key: 'majorId'
  },
  {
    title: '专业名称',
    align: 'start',
    sortable: true,
    key: 'majorName'
  },
  {
    title: '操作',
    align: 'center',
    key: 'operations',
    sortable: false
  }
]

const collegeName = ref('计算机与信息安全学院')
const majorFormDialog = ref(false)
const deleteDialog = ref(false)
const selected = ref<Major[]>([])
const data = ref<Major[]>([])
const loading = ref(true)
const editInfo = ref<Major>({
  majorId: '',
  majorName: ''
})
const formType = ref<'edit' | 'add'>('edit')

const store = useUserStore()
const has = (permission: string) => {
  return store.hasAuthorized(permission)
}
const fetchMajorLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetMajorList()
  if (result.code !== 200) {
    loading.value = false
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  data.value = result.data
  selected.value = []
  loading.value = false
}

const updateCollegeNameHandler = () => {
  notify({ type: 'success', title: '成功', text: '修改成功！' })
}
onMounted(() => {
  fetchMajorLogic()
})

const afterForm = () => {
  majorFormDialog.value = false
  fetchMajorLogic()
}

const deleteLogic = async () => {
  loading.value = true

  let reqs = selected.value.map((u) =>
    (async (u) => {
      const majorId = u.majorId
      const { data: result } = await apiDeleteMajor(majorId)
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: `专业: ${majorId}, ` + result.message })
        return
      }
      notify({ type: 'success', title: '成功', text: `专业:${majorId} 删除成功！` })
    })(u)
  )

  await Promise.all(reqs)

  loading.value = false
  deleteDialog.value = false
  fetchMajorLogic()
}

// js 写响应式
const tableHeight = ref(0)
const tableDom = ref<HTMLElement | null>(null)
const fixHeight = () => {
  const offsetTop = tableDom.value?.offsetTop as number
  const windowHeight = window.screen.height as number
  const totalHeight = document.body.clientHeight
  const padding = ((totalHeight * 0.5) / windowHeight) * 32
  tableHeight.value = (totalHeight - offsetTop) * 0.78 - padding
}
onMounted(() => {
  fixHeight()
  window.onresize = fixHeight
})
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <MajorForm
      v-model="majorFormDialog"
      v-model:info="editInfo"
      v-model:type="formType"
      @on-closed="afterForm"
    />
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteLogic" />
    <section class="menu">
      <span class="w-20 text-indigo">
        <v-text-field
          v-model="collegeName"
          color="indigo"
          variant="outlined"
          label="学院名称"
          hide-details
        ></v-text-field>
      </span>
      <!-- 假的 uwu -->
      <v-btn color="primary" text="修改" @click="updateCollegeNameHandler"></v-btn>
    </section>
    <section class="menu">
      <span>
        <v-btn v-if="has('user:select')" prepend-icon="mdi-refresh" @click="fetchMajorLogic"
          >刷新</v-btn
        >
        <v-btn
          v-if="has('major:insert')"
          prepend-icon="mdi-plus-circle"
          color="primary"
          @click="
            (formType = 'add'),
              (editInfo = { majorId: '', majorName: '' }),
              (majorFormDialog = true)
          "
          >添加</v-btn
        >
        <v-btn
          v-if="has('major:delete')"
          prepend-icon="mdi-delete"
          color="error"
          @click="deleteDialog = true"
          >删除</v-btn
        >
      </span>
    </section>
    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :height="tableHeight"
          :items="data"
          :loading="loading"
          show-select
          return-object
        >
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                v-if="has('major:update')"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="
                  () => {
                    formType = 'edit'
                    editInfo = item
                    majorFormDialog = true
                  }
                "
                >编辑</v-btn
              >
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
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}

.menu span > * {
  margin-right: 0.5rem;
}

.w-20 {
  width: 20% !important;
}
</style>
