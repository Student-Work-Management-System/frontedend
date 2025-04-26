<script setup lang="ts">
import { apiGetForeignLanguageStat } from '@/api/foreign'
import LanguageSelect from '@/components/home/foreign/LanguageSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import type { ForeignLanguageStatItem, ForeignLanguageStatQuery } from '@/model'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const chargeGrades = store.user.chargeGrades
const query = reactive<ForeignLanguageStatQuery>({
  gradeId: null,
  majorId: null,
  languageId: null
})
const loading = ref<boolean>(false)
const items = ref<ForeignLanguageStatItem[]>([])
const selected = ref<ForeignLanguageStatItem[]>([])

const getForeignLanguageStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetForeignLanguageStat(query)
    if (result.code !== 200) {
      console.error(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    items.value = result.data
    selected.value = []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
onMounted(getForeignLanguageStat)

// 计算所有出现过的语言名称
const allLanguages = computed(() => {
  const set = new Set<string>()
  items.value.forEach((item) => {
    item.languageStatItems.forEach((lang) => {
      set.add(lang.languageName)
    })
  })
  return Array.from(set)
})

// 转换扁平表格数据
const tableData = computed(() => {
  return items.value.map((item) => {
    const row: any = {
      majorName: item.majorName
    }
    allLanguages.value.forEach((language) => {
      const found = item.languageStatItems.find((l) => l.languageName === language)
      if (found) {
        const pass = Number(found.passNumber)
        const total = Number(found.totalNumber)
        const percent = total > 0 ? ((pass / total) * 100).toFixed(2) + '%' : '-'
        row[`${language}_passNumber`] = found.passNumber
        row[`${language}_totalNumber`] = found.totalNumber
        row[`${language}_rate`] = percent
      } else {
        row[`${language}_passNumber`] = '-'
        row[`${language}_totalNumber`] = '-'
        row[`${language}_rate`] = '-'
      }
    })
    return row
  })
})

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value - 75
})
onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('tabs')) {
        tabsHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const tabs = document.querySelector('.tabs')
  const menu = document.querySelector('.menu')
  if (container) resizeObserver.observe(container)
  if (tabs) resizeObserver.observe(tabs)
  if (menu) resizeObserver.observe(menu)
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <section class="menu">
      <span class="w-15">
        <GradeSelect
          v-model="query.gradeId"
          :chargeGrades="chargeGrades"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-15">
        <MajorSelect v-model="query.majorId" variant="underlined" density="compact" />
      </span>
      <span class="w-15">
        <LanguageSelect v-model="query.languageId" variant="underlined" density="compact" />
      </span>
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="has('foreign:select')"
        text="刷新"
        @click="getForeignLanguageStat"
      />
    </section>
    <section class="pa-4 w-100">
      <v-card>
        <el-table :data="tableData" :height="tableHeight" border>
          <el-table-column prop="majorName" label="专业名称" width="150" align="center" fixed />
          <!-- 动态外语分组列 -->
          <template v-for="lang in allLanguages" :key="lang">
            <el-table-column :label="lang" width="250" align="center">
              <!-- 子列：通过人数 -->
              <el-table-column
                :prop="`${lang}_passNumber`"
                label="通过人数"
                width="125"
                align="center"
              />
              <!-- 子列：总人数 -->
              <el-table-column
                :prop="`${lang}_totalNumber`"
                label="总人数"
                width="125"
                align="center"
              />
              <!-- 子列：通过率 -->
              <el-table-column :prop="`${lang}_rate`" label="通过率" width="125" align="center" />
            </el-table-column>
          </template>
        </el-table>
      </v-card>
    </section>
  </v-card>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}

.menu > * {
  margin-right: 0.5rem;
}

.w-10 {
  width: 10% !important;
}

.w-15 {
  width: 15% !important;
}
</style>
