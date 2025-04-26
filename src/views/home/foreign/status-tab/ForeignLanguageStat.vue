<script setup lang="ts">
import LanguageSelect from '@/components/home/foreign/LanguageSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import type { ForeignLanguageStatQuery } from '@/model'
import { useUserStore } from '@/stores/userStore'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const query = ref<ForeignLanguageStatQuery>({
  gradeId: null,
  majorId: null,
  languageId: null
})

const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value
})
onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('tabs')) {
        tabsHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const tabs = document.querySelector('.tabs')

  if (container) resizeObserver.observe(container)
  if (tabs) resizeObserver.observe(tabs)

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
    </section>
    <section class="pa-4 w-100" ref="tableDom">
      <v-card> </v-card>
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
