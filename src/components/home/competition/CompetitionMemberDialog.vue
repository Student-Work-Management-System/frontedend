<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { apiGetStudentBasicList } from '@/api/student'
import type { StudentBasicItem } from '@/model/studentModel'
import { notify } from '@kyvg/vue3-notification'

const model = defineModel<boolean>()
const props = defineProps<{
  studentIds: string[]
}>()

const loading = ref(false)
const students = ref<StudentBasicItem[]>([])
const emit = defineEmits(['on-close'])

const closeDialog = () => {
  emit('on-close')
}
const fetchStudents = async () => {
  if (props.studentIds.length <= 0) return
  const { data: result } = await apiGetStudentBasicList(props.studentIds)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  students.value = result.data
}

watchEffect(() => {
  if (model.value) {
    fetchStudents()
  }
})
</script>

<template>
  <v-dialog v-model="model" width="600">
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon start icon="mdi-account-group" class="mr-2" />
        团队成员信息
      </v-card-title>

      <v-card-text>
        <v-list v-if="!loading && students.length">
          <v-list-item
            v-for="student in students"
            :key="student.studentId"
            :title="`${student.studentId} - ${student.name}`"
            :subtitle="`${student.majorName} - ${student.gradeName}`"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-account" />
            </template>

            <template v-slot:append>
              <v-chip :color="student.gender === '男' ? 'blue' : 'pink'" size="small">
                {{ student.gender }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>

        <v-progress-circular v-else-if="loading" indeterminate color="primary" class="ma-4" />

        <v-alert v-else type="info" text="暂无团队成员信息" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="closeDialog"
          prepend-icon="mdi-close"
          text="关闭"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-list-item {
  margin-bottom: 8px;
  border-radius: 4px;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-primary), 0.1);
}
</style>
