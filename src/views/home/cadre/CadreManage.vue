<!-- eslint-disable vue/valid-v-slot -->
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { apiGetCadreList, apiDeleteCadre } from '@/api/cadre'
import type { Cadre } from '@/model/cadreModel'
import { notify } from '@kyvg/vue3-notification'
import AddCadreForm from '@/components/home/cadre/AddCadreForm.vue'
import EditCadreForm from '@/components/home/cadre/EditCadreForm.vue'
import { useUserStore } from '@/stores/userStore'
import { cadreTableHeaders } from '@/misc/table/cadre-import-headers'

const selected = ref<Cadre[]>([])
const loading = ref(true)
const data = ref<any>([])
const addCadreFormDialog = ref(false)
const deleteDialog = ref(false)
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const editCadreInfoFormDialog = ref(false)
const editInfo = ref<Cadre>({
  cadreId: '',
  cadrePosition: '',
  cadreLevel: '',
  cadreBelong: ''
})

const fetchCadreLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetCadreList()
  if (result.code !== 200) {
    console.log(result.message)
    notify({ title: '错误', text: result.message, type: 'error' })
    return
  }
  selected.value = []
  data.value = result.data
  loading.value = false
}

const afterCadre = () => {
  addCadreFormDialog.value = false
  editCadreInfoFormDialog.value = false
  deleteDialog.value = false
  selected.value = []
  fetchCadreLogic()
}

const deleteCadreLogic = async () => {
  loading.value = true
  let reqs = selected.value.map((c) =>
    (async (c) => {
      const cadrePosition = c.cadrePosition
      const cadreId = c.cadreId
      const { data: result } = await apiDeleteCadre(cadreId!)
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
      notify({ type: 'success', title: '成功', text: `职位:${cadrePosition} 删除成功！` })
    })(c)
  )
  await Promise.all(reqs)
  afterCadre()
  loading.value = false
}

const onEdit = (item: Cadre) => {
  editInfo.value = item
  editCadreInfoFormDialog.value = true
}

onMounted(fetchCadreLogic)

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
    <AddCadreForm v-model="addCadreFormDialog" @on-closed="afterCadre" />
    <EditCadreForm v-model="editCadreInfoFormDialog" :info="editInfo" @on-closed="afterCadre" />
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
            @click="deleteCadreLogic"
            text="删除"
          />
          <v-btn @click="deleteDialog = false" text="取消" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <section class="menu">
      <v-btn
        v-if="has('cadre:select')"
        prepend-icon="mdi-refresh"
        @click="fetchCadreLogic"
        text="刷新"
      />
      <v-btn
        v-if="has('cadre:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addCadreFormDialog = true"
        text="添加"
      />
      <v-btn
        v-if="has('cadre:delete')"
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
          :headers="cadreTableHeaders as any"
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
                v-if="has('cadre:update')"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="onEdit(item as Cadre)"
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
