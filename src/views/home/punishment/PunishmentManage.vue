<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { apiGetPunishments, apiDeletePunishmentItem } from '@/api/punishment'
import { notify } from '@kyvg/vue3-notification'
import AddPunishmentForm from '@/components/home/punishment/AddPunishmentForm.vue'
import EditPunishmentForm from '@/components/home/punishment/EditPunishmentForm.vue'
import { useUserStore } from '@/stores/userStore'
import type { Punishment } from '@/model/punishmentModel'
import { punishmentTableHeaders } from '@/misc/table'
import type { BaseQuery } from '@/api'

const selected = ref<Punishment[]>([])
const loading = ref(true)
const data = ref<Punishment[]>([])
const addPunishmentFormDialog = ref(false)
const editPunishmentFormDialog = ref(false)
const deleteDialog = ref(false)
const store = useUserStore()
const has = (authority: string) => store.hasAuthorized(authority)
const baseQuery = reactive<BaseQuery>({
  pageNo: 1,
  pageSize: 10
})
const editInfo = ref<Punishment>({
  punishmentId: '',
  punishmentName: ''
})

const fetchPunishmentList = async () => {
  loading.value = true
  try {
    const { data: result } = await apiGetPunishments(baseQuery)
    if (result.code !== 200) {
      notify({ title: '错误', text: result.message, type: 'error' })
      return
    }
    selected.value = []
    data.value = result.data.records
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const afterAction = () => {
  addPunishmentFormDialog.value = false
  editPunishmentFormDialog.value = false
  deleteDialog.value = false
  selected.value = []
  fetchPunishmentList()
}

const deleteLogic = async () => {
  loading.value = true
  let reqs = selected.value.map((p) =>
    (async (p) => {
      const punishmentId = p.punishmentId
      const { data: result } = await apiDeletePunishmentItem(punishmentId!!)
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
    })(p)
  )
  await Promise.all(reqs)
  notify({ type: 'success', title: '成功', text: '删除成功' })
  afterAction()
  loading.value = false
}

const onEdit = (item: Punishment) => {
  editInfo.value = item
  editPunishmentFormDialog.value = true
}

onMounted(fetchPunishmentList)

// 高度计算
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(
  () => containerHeight.value - selectMenuHeight.value - tabsHeight.value - 100
)

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
    <AddPunishmentForm v-model="addPunishmentFormDialog" @on-closed="afterAction" />
    <EditPunishmentForm
      v-model="editPunishmentFormDialog"
      :info="editInfo"
      @on-closed="afterAction"
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
            text="删除"
            :disabled="selected.length === 0"
            color="error"
            @click="deleteLogic"
          />
          <v-btn @click="deleteDialog = false" text="取消" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <section class="menu">
      <v-btn
        v-if="has('punishment:select')"
        text="刷新"
        prepend-icon="mdi-refresh"
        @click="fetchPunishmentList"
      />
      <v-btn
        v-if="has('punishment:insert')"
        text="添加"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addPunishmentFormDialog = true"
      />
      <v-btn
        v-if="has('punishment:delete')"
        text="删除"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
      />
    </section>

    <section class="pa-4 w-100">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="punishmentTableHeaders as any"
          :height="tableHeight"
          :items="data"
          :loading="loading"
          show-select
          return-object
        >
          <!--eslint-disable-next-line vue/valid-v-slot-->
          <template v-slot:item.operations="{ item }">
            <v-btn
              v-if="has('punishment:update')"
              text="编辑"
              prepend-icon="mdi-pencil"
              color="indigo"
              @click="onEdit(item as Punishment)"
            />
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
