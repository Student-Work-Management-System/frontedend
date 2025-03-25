<!-- eslint-disable vue/valid-v-slot -->
<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { ref } from 'vue'
import { apiGetLanguages, apiDeleteLanguage } from '@/api/foreign'
import type { Language } from '@/model/foreignModel'
import { notify } from '@kyvg/vue3-notification'
import AddLanguageForm from '@/components/home/foreign/AddLanguageFrom.vue'
import EditLanguageForm from '@/components/home/foreign/EditLanguageForm.vue'
import { useUserStore } from '@/stores/userStore'
import { languageTableHeaders } from '@/misc/table/foreign-import.header'

const selected = ref<Language[]>([])
const loading = ref(true)
const data = ref<any>([])
const addLanguageFormDialog = ref(false)
const selectPermissionDialog = ref(false)
const deleteDialog = ref(false)
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const editLanguageInfoFormDialog = ref(false)
const editInfo = ref<Language>({
  languageName: '',
  type: '',
  total: ''
})

const fetchLanguageLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetLanguages()
  if (result.code !== 200) {
    console.log(result.message)
    notify({ title: '错误', text: result.message, type: 'error' })
    return
  }
  selected.value = []
  data.value = result.data
  loading.value = false
}

const afterLanguage = () => {
  addLanguageFormDialog.value = false
  selectPermissionDialog.value = false
  editLanguageInfoFormDialog.value = false
  deleteDialog.value = false
  selected.value = []
  fetchLanguageLogic()
}

const deleteLanguageLogic = async () => {
  loading.value = true
  let reqs = selected.value.map((c) =>
    (async (c) => {
      const languageName = c.languageName
      const languageId = c.languageId
      const { data: result } = await apiDeleteLanguage(languageId!!)
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
      notify({ type: 'success', title: '成功', text: `语言:${languageName} 删除成功！` })
    })(c)
  )

  await Promise.all(reqs)
  afterLanguage()
  loading.value = false
}

const onEdit = (item: Language) => {
  editInfo.value = item
  editLanguageInfoFormDialog.value = true
}

onMounted(fetchLanguageLogic)

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
    <AddLanguageForm v-model="addLanguageFormDialog" @on-closed="afterLanguage" />
    <EditLanguageForm
      v-model="editLanguageInfoFormDialog"
      :info="editInfo"
      @on-closed="afterLanguage"
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
            @click="deleteLanguageLogic"
            text="删除"
          />
          <v-btn @click="deleteDialog = false" text="取消" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <section class="menu">
      <v-btn
        v-if="has('foreign:select')"
        prepend-icon="mdi-refresh"
        @click="fetchLanguageLogic"
        text="刷新"
      />
      <v-btn
        v-if="has('foreign:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addLanguageFormDialog = true"
        text="添加"
      />
      <v-btn
        v-if="has('foreign:delete')"
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
          :headers="languageTableHeaders as any"
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
                v-if="has('foreign:update')"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="() => onEdit(item as Language)"
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
