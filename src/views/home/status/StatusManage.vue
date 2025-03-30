<!-- eslint-disable vue/valid-v-slot -->
<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { ref } from 'vue'
import { apiGetAllStatus, apiDeleteStatus } from '@/api/status'
import { notify } from '@kyvg/vue3-notification'
import AddStatusForm from '@/components/home/status/AddStatusForm.vue'
import { useBaseStore } from '@/stores/baseStore'
import EditStatusForm from '@/components/home/status/EditStatusForm.vue'
import { useUserStore } from '@/stores/userStore'
import { statusTableHeaders } from '@/misc/table'
import type { Status } from '@/model/statusModel'

const selected = ref<Status[]>([])
const loading = ref(false)
const data = ref<any>([])
const store = useUserStore()
const baseStore = useBaseStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const deleteDialog = ref(false)
const addStatusFormDialog = ref(false)
const editStatusFormDialog = ref(false)
const editInfo = ref<Status>({
  statusName: ''
})

const fetchStatusLogic = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetAllStatus()
    if (result.code !== 200) {
      console.log(result.message)
      notify({ title: '错误', text: result.message, type: 'error' })
    }
    baseStore.updateStatusList(result.data)
    data.value = result.data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const afterStatus = () => {
  editStatusFormDialog.value = false
  addStatusFormDialog.value = false
  deleteDialog.value = false
  selected.value = []
  fetchStatusLogic()
}

const deleteStatusLogic = async () => {
  try {
    loading.value = true
    let reqs = selected.value.map((item: Status) =>
      (async (item) => {
        const statusId = item.statusId!!
        const statusName = item.statusName
        const { data: result } = await apiDeleteStatus(statusId)
        if (result.code !== 200) {
          console.error(result)
          notify({ type: 'error', title: '错误', text: result.message })
          return
        }
        notify({ type: 'success', title: '成功', text: `学籍状态:${statusName} 删除成功！` })
      })(item)
    )
    await Promise.all(reqs)
    deleteDialog.value = false
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    fetchStatusLogic()
  }
}

const onEdit = (item: Status) => {
  editInfo.value = item
  editStatusFormDialog.value = true
}

onMounted(fetchStatusLogic)

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
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <AddStatusForm v-model="addStatusFormDialog" @on-closed="afterStatus" />
    <EditStatusForm v-model="editStatusFormDialog" :info="editInfo" @on-closed="afterStatus" />
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
            @click="deleteStatusLogic"
            text="删除"
          />
          <v-btn @click="deleteDialog = false" text="取消" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <section class="menu">
      <v-btn
        v-if="has('student_status:select')"
        prepend-icon="mdi-refresh"
        @click="fetchStatusLogic"
        text="刷新"
      />
      <v-btn
        v-if="has('student_status:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addStatusFormDialog = true"
        text="添加"
      />
      <v-btn
        v-if="has('student_status:delete')"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
        text="删除"
      />
    </section>

    <section class="pa-4 d-inline-block w-100" ref="tableDom">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="statusTableHeaders as any"
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
                v-if="has('student_status:update')"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="onEdit(item as Status)"
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
  padding: 1rem 1rem 0 1rem;
}

.menu > * {
  margin-right: 0.5rem;
}
</style>
