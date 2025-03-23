<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { ref } from 'vue'
import { apiGetPovertyAssistanceList, apiDeletePovertyAssistance } from '@/api/poverty'
import { notify } from '@kyvg/vue3-notification'
import AddPovertyForm from '@/components/home/poverty/AddPovertyForm.vue'
import EditPovertyForm from '@/components/home/poverty/EditPovertyForm.vue'
import { useUserStore } from '@/stores/userStore'
import type { PovertyAssistance } from '@/model/povertyModel'
import { povertyTableHeaders } from '@/misc/table/poverty-import-header'

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
  selected.value = []
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
  let reqs = selected.value.map((p) =>
    (async (p) => {
      const povertyAssistanceId = p.povertyAssistanceId
      const { data: result } = await apiDeletePovertyAssistance(povertyAssistanceId!!)
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
    })(p)
  )

  await Promise.all(reqs)
  notify({ type: 'success', title: '成功', text: `删除成功！` })
  afterPoverty()
  loading.value = false
}

const onEdit = (item: PovertyAssistance) => {
  editInfo.value = item
  editPovertyInfoFormDialog.value = true
}

onMounted(fetchPovertyLogic)

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value - 100
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
            text="删除"
            :disabled="selected.length === 0"
            color="error"
            @click="deletePovertyLogic"
          />
          <v-btn @click="deleteDialog = false" text="取消" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <section class="menu">
      <v-btn
        v-if="has('poverty_assistance:select')"
        text="刷新"
        prepend-icon="mdi-refresh"
        @click="fetchPovertyLogic"
      />
      <v-btn
        v-if="has('poverty_assistance:insert')"
        text="添加"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addPovertyFormDialog = true"
      />
      <v-btn
        v-if="has('poverty_assistance:delete')"
        text="删除"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="povertyTableHeaders as any"
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
                v-if="has('poverty_assistance:update')"
                text="编辑"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="onEdit(item as PovertyAssistance)"
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
