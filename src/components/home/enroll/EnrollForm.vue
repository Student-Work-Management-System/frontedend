<script lang="ts" setup>
import { ref } from 'vue'
import { type Enrollment, apiUpdateEnrollment } from '@/api/enroll'
import { notify } from '@kyvg/vue3-notification'

const dialog = defineModel<boolean>()
const model = defineModel<Enrollment>('info', { required: true })
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const form = ref(false)

const updateEnrollmentInfoLogic = async () => {
  const { data: result } = await apiUpdateEnrollment(model.value)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '毕业信息修改成功！' })
  loading.value = false
  emits('onClosed')
}
</script>

<template>
  <v-dialog v-model="dialog" width="400">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-pencil" title="修改信息">
      <v-container class="px-8">
        <v-form v-model="form" class="text-indigo">
          <v-text-field label="准考证号" color="indigo" v-model="model.examineeId" clearable required
            :rules="[() => !!model.examineeId || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <v-text-field v-model="model.id" label="身份证号" clearable required :rules="[() => !!model.name || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <v-text-field label="姓名" v-model="model.name" clearable required :rules="[() => !!model.name || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <v-text-field label="生源地" v-model="model.origin" clearable required :rules="[() => !!model.origin || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <v-text-field label="招生年份" v-model="model.enrollTime" clearable required
            :rules="[() => !!model.enrollTime || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <MajorSelect label="录取专业" v-model="model.enrollMajorId" class="mb-6" clearable required
            :rules="[() => !!model.enrollMajorId || '该选项必填']">
            <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
          </MajorSelect>

          <v-text-field label="第一志愿专业" v-model="model.firstMajor" clearable required
            :rules="[() => !!model.firstMajor || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <v-text-field label=" 高考分数" v-model="model.score" clearable required :rules="[() => !!model.score || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>
        </v-form>
      </v-container>

      <v-divider></v-divider>

      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn :disabled="!form" text="下一步" :loading="loading" color="indigo" variant="plain"
          @click="updateEnrollmentInfoLogic"></v-btn>
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>
