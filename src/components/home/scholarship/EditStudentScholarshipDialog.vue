<script lang="ts" setup>
import { apiUpdateStudentScholarships } from '@/api/scholarship'
import type { StudentScholarship, StudentScholarshipItem } from '@/model/scholarshipModel'
import { notify } from '@kyvg/vue3-notification'
import { ref, watchEffect } from 'vue'
import ScholarshipSelect from './ScholarshipSelect.vue'

const model = defineModel<boolean>()
const info = defineModel<StudentScholarshipItem>('info')
const localInfo = ref<StudentScholarshipItem>()
watchEffect(() => {
  if (model.value && info.value) {
    localInfo.value = { ...info.value }
  }
})
const emits = defineEmits(['onClosed'])
const form = ref(false)
const loading = ref(false)

const onCancel = () => {
  model.value = false
}

const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateStudentScholarships(localInfo.value as StudentScholarship)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-card width="auto" prepend-icon="mdi-account-edit" :title="localInfo!.name + '奖学金信息'">
      <v-container>
        <v-form v-model="form" class="px-8">
          <ScholarshipSelect v-model="localInfo!.scholarshipId">
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </ScholarshipSelect>
          <v-text-field
            class="text-indigo mt-4"
            color="indigo"
            label="获奖学年"
            v-model="localInfo!.awardYear"
            required
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </template>
          </v-text-field>
        </v-form>
      </v-container>

      <v-divider></v-divider>

      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn
          :disabled="!form"
          text="确定"
          color="indigo"
          @click="updateInfoLogic"
          variant="plain"
        />
        <v-btn text="取消" @click="onCancel" variant="plain" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.svg-icon {
  margin-right: 0.5rem;
}
.form > * {
  margin-bottom: 0.5rem;
}

.mb-1 {
  margin-bottom: 1rem !important;
}
</style>
