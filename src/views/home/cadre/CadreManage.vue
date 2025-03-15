<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { apiGetCadreList, apiDeleteCadre, apiUpdateCadreInfo, type Cadre } from '@/api/cadre'
import { notify } from '@kyvg/vue3-notification'
import AddCadreForm from '@/components/home/cadre/AddCadreForm.vue'
import EditCadreForm from '@/components/home/cadre/EditCadreForm.vue'
import { useUserStore } from '@/stores/userStore'

const headers = [
  {
    title: '职位ID',
    align: 'start',
    sortable: true,
    key: 'cadreId'
  },
  {
    title: '职位名称',
    align: 'start',
    sortable: false,
    key: 'cadrePosition'
  },
  {
    title: '职位级别',
    align: 'start',
    sortable: false,
    key: 'cadreLevel'
  },
  {
    title: '操作',
    align: 'center',
    sortable: false,
    key: 'operations'
  }
]

const selected = ref<Cadre[]>([])
const loading = ref(true)
const data = ref<any>([])
const addCadreFormDialog = ref(false)
const selectPermissionDialog = ref(false)
const deleteDialog = ref(false)
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const editCadreInfoFormDialog = ref(false)
const editInfo = ref<Cadre>({
  cadreId: '',
  cadrePosition: '',
  cadreLevel: ','
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
  selectPermissionDialog.value = false
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
      const { data: result } = await apiDeleteCadre(cadreId)
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

onMounted(fetchCadreLogic)

// js 写响应式
const tableHeight = ref(0)
const tableDom = ref<HTMLElement | null>(null)
const fixHeight = () => {
  const offsetTop = tableDom.value?.offsetTop as number
  const windowHeight = window.screen.height as number
  const totalHeight = document.body.clientHeight
  const padding = ((totalHeight * 0.5) / windowHeight) * 32
  tableHeight.value = (totalHeight - offsetTop) * 0.8 - padding
}
onMounted(() => {
  fixHeight()
  window.onresize = fixHeight
})
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
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
            >删除</v-btn
          >
          <v-btn @click="deleteDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <section class="menu">
      <v-btn v-if="has('cadre:select')" prepend-icon="mdi-refresh" @click="fetchCadreLogic"
        >刷新</v-btn
      >
      <v-btn
        v-if="has('cadre:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addCadreFormDialog = true"
        >添加</v-btn
      >

      <v-btn
        v-if="has('cadre:delete')"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
        >删除</v-btn
      >
    </section>

    <section class="pa-4 d-inline-block w-100" ref="tableDom">
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
                v-if="'cadre:update'"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="
                  () => {
                    editInfo = JSON.parse(JSON.stringify(item))
                    editCadreInfoFormDialog = true
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
  padding: 1rem 1rem 0 1rem;
}

.menu > * {
  margin-right: 0.5rem;
}
</style>
