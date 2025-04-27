<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { apiGetScholarships, apiDeleteScholarships } from '@/api/scholarship'
import type { Scholarship } from '@/model/scholarshipModel'
import { useUserStore } from '@/stores/userStore'
import { useScholarshipStore } from '@/stores/scholarshipStore'
import { notify } from '@kyvg/vue3-notification'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { scholarshipTableHeaders } from '@/misc/table/scholarship-import-header'
import AddScholarshipDialog from '@/components/home/scholarship/AddScholarshipDialog.vue'
import EditScholarshipDialog from '@/components/home/scholarship/EditScholarshipDialog.vue'

const selected = ref<Scholarship[]>([])
const scholarshipStore = useScholarshipStore()
const loading = ref(false)
const data = ref<Scholarship[]>([])
const addDialog = ref(false)
const deleteDialog = ref(false)
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const editDialog = ref(false)
const editInfo = ref<Scholarship>({
  scholarshipName: '',
  scholarshipLevel: ''
})

const fetchScholarship = async () => {
  loading.value = true
  try {
    const { data: result } = await apiGetScholarships()
    if (result.code !== 200) {
      console.log(result.message)
      notify({ title: '错误', text: result.message, type: 'error' })
      return
    }
    data.value = result.data
    scholarshipStore.setScholarshipList(result.data)
  } catch (error) {
    console.log(error)
  } finally {
    selected.value = []
    loading.value = false
  }
}

const deleteScholarship = async () => {
  loading.value = true
  try {
    let reqs = selected.value.map((c) =>
      (async (c) => {
        const scholarshipId = c.scholarshipId
        const { data: result } = await apiDeleteScholarships(scholarshipId!)
        if (result.code !== 200) {
          console.error(result)
          notify({ type: 'error', title: '错误', text: result.message })
          return
        }
        notify({ type: 'success', title: '成功', text: '删除成功！' })
      })(c)
    )
    await Promise.all(reqs)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    afterScholar()
  }
}

const afterScholar = () => {
  editDialog.value = false
  selected.value = []
  deleteDialog.value = false
  addDialog.value = false
  fetchScholarship()
}

const onEdit = (item: Scholarship) => {
  editInfo.value = item
  editDialog.value = true
}

onMounted(() => {
  if (scholarshipStore.getScholarshipList().length <= 0) {
    fetchScholarship()
  } else {
    data.value = scholarshipStore.getScholarshipList()
  }
})

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
    <AddScholarshipDialog v-model="addDialog" @on-closed="afterScholar" />
    <DeleteDialog v-model="deleteDialog" :length="selected.length" @delete="deleteScholarship" />
    <EditScholarshipDialog v-model="editDialog" :info="editInfo" @on-closed="afterScholar" />
    <section class="menu">
      <v-btn
        v-if="has('scholarship:select')"
        prepend-icon="mdi-refresh"
        @click="fetchScholarship"
        text="刷新"
      />
      <v-btn
        v-if="has('scholarship:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addDialog = true"
        text="添加"
      />
      <v-btn
        v-if="has('scholarship:delete')"
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
          :headers="scholarshipTableHeaders as any"
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
                @click="onEdit(item as Scholarship)"
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
