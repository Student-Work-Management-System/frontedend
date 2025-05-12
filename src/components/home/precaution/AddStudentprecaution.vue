<script lang="ts" setup>
import { apiAddStudentPrecaution, levelOptions } from '@/api/precaution'
import type { StudentPrecaution } from '@/model/precautionModel'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])

const form = ref(false)
const loading = ref(false)

const newStudentPrecaution = ref<StudentPrecaution>({
  studentId: '',
  levelCode: null,
  term: '',
  detail: ''
})

const onCancel = () => {
  model.value = false
  newStudentPrecaution.value.levelCode = null
  newStudentPrecaution.value.term = ''
  newStudentPrecaution.value.detail = ''
  newStudentPrecaution.value.studentId = ''
}

const addInfoLogic = async () => {
  const valid = formRef.value?.validate()
  if (!valid) return
  loading.value = true
  const { data: result } = await apiAddStudentPrecaution(newStudentPrecaution.value!)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  loading.value = false
  emits('onClosed')
  model.value = false
}

const formRef = ref()
</script>

<template>
  <v-dialog width="auto" min-width="600" v-model="model">
    <v-card title="添加学业预警信息">
      <v-container>
        <v-form ref="formRef" v-model="form" class="px-6">
          <v-text-field
            class="text-indigo"
            label="学号"
            v-model="newStudentPrecaution.studentId"
            variant="filled"
            required
            :rules="[(v) => !!v || '学号为必填项']"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </template>
          </v-text-field>
          <v-select
            class="text-indigo"
            label="预警等级"
            v-model="newStudentPrecaution.levelCode"
            :items="levelOptions"
            item-title="label"
            item-value="value"
            variant="filled"
            required
            :rules="[(v) => !!v || '预警等级为必填项']"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </template>
          </v-select>

          <v-text-field
            class="text-indigo"
            label="学期"
            v-model="newStudentPrecaution.term"
            variant="filled"
            required
            :rules="[
              (v) => !!v || '学期为必填项',
              (v) => /^\d{4}-\d{4}_[12]$/.test(v) || '学期格式应为：2024-2025_1'
            ]"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </template>
          </v-text-field>

          <v-textarea
            class="text-indigo"
            label="详细描述"
            v-model="newStudentPrecaution.detail"
            variant="filled"
            required
          />
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn color="primary" :disabled="!form" @click="addInfoLogic" text="添加" />
        <v-btn @click="onCancel" text="取消" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
