<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onUnmounted, ref } from 'vue'
import { apiDeleteMajor, apiGetMajorList } from '@/api/other'
import MajorForm from '@/components/home/system/MajorForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { onMounted } from 'vue'
import type { Major } from '@/model/otherModel'

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

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - 100
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.menu')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>
<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column card-container">
    <MajorForm
      v-model="majorFormDialog"
      v-model:info="editInfo"
      v-model:type="formType"
      @on-closed="afterForm"
    />
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteLogic" />

    <section class="menu">
      <span>
        <v-btn
          v-if="has('user:select')"
          prepend-icon="mdi-refresh"
          @click="fetchMajorLogic"
          text="刷新"
        />
        <v-btn
          v-if="has('major:insert')"
          prepend-icon="mdi-plus-circle"
          color="primary"
          text="添加"
          @click="
            (formType = 'add'),
              (editInfo = { majorId: '', majorName: '' }),
              (majorFormDialog = true)
          "
        />
        <v-btn
          v-if="has('major:delete')"
          prepend-icon="mdi-delete"
          color="error"
          @click="deleteDialog = true"
          text="删除"
        />
      </span>
    </section>
    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="headers as any"
          :height="tableHeight"
          :items="data"
          :loading="loading"
          show-select
          return-object
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
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
                text="编辑"
              />
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
