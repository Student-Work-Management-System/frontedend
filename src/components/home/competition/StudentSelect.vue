<script lang="ts" setup>
import { apiGetStudentBasic } from '@/api/student'
import type { StudentBasicItem } from '@/model/studentModel'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'

const model = defineModel<string[]>()
const search = ref('')
const items = ref<any[]>([])
const props = defineProps<{
  variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
}>()

const onSearch = async (text: string) => {
  items.value = []
  if (!text) return
  const { data: result } = await apiGetStudentBasic(text)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    console.log(result.message)
    return
  }
  items.value = result.data.map((student: StudentBasicItem) => ({
    title: `${student.studentId} - ${student.name} - ${student.gender} - ${student.majorName} - ${student.gradeName}`,
    value: student.studentId
  }))
}
</script>

<template>
  <v-autocomplete
    v-model="model"
    v-model:search="search"
    :items="items"
    item-title="title"
    item-value="value"
    class="text-indigo"
    color="indigo"
    label="选择学生"
    :variant="props.variant"
    multiple
    chips
    closable-chips
    hide-details
    clearable
    @update:search="onSearch"
  >
    <template v-slot:prepend>
      <v-icon size="smaller" color="error" icon="mdi-asterisk" />
    </template>

    <!-- 自定义选项显示 -->
    <template v-slot:item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps">
        <template v-slot:prepend>
          <v-icon icon="mdi-account" />
        </template>
        <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
      </v-list-item>
    </template>

    <!-- 自定义选中标签显示 -->
    <template v-slot:chip="{ props, item }">
      <v-chip v-bind="props" :text="item.raw.value" closable />
    </template>
  </v-autocomplete>
</template>

<style scoped>
.v-autocomplete {
  width: 100%;
}
</style>
