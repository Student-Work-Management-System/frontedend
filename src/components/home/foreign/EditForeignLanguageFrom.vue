<script lang="ts" setup>
import { notify } from '@kyvg/vue3-notification'
import { ref, watchEffect } from 'vue'
import LanguageSelect from '@/components/home/foreign/LanguageSelect.vue'
import SemesterSelect from '@/components/home/SemesterSelect.vue'
import { apiUpdateForeignLanguage } from '@/api/foreign'
import { type ForeignLanguageItem, type ForeignLanguage } from '@/model/foreignModel'

const model = defineModel<boolean>()
const info = defineModel<ForeignLanguageItem>('info')
const localInfo = ref<ForeignLanguageItem>()
// 当弹窗打开时，创建副本
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
  const { data: result } = await apiUpdateForeignLanguage(localInfo.value as ForeignLanguage)
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
    <v-card
      width="auto"
      prepend-icon="mdi-account-edit"
      :title="localInfo!.name + '的外语考试成绩'"
    >
      <v-container>
        <v-form v-model="form" class="px-8">
          <LanguageSelect
            class="mb-4"
            v-model="localInfo!.languageId"
            label="语言"
            variant="filled"
            density="comfortable"
          >
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </LanguageSelect>

          <SemesterSelect
            class="mb-4"
            v-model="localInfo!.date"
            label="考试时间"
            variant="filled"
            density="comfortable"
          >
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </SemesterSelect>

          <v-text-field
            label="证书编号"
            class="text-indigo"
            color="indigo"
            v-model="localInfo!.certificate"
            required
            variant="filled"
            density="comfortable"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" icon="" />
            </template>
          </v-text-field>

          <v-text-field
            label="成绩"
            class="text-indigo"
            color="indigo"
            v-model="localInfo!.score"
            required
            variant="filled"
            density="comfortable"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" icon="" />
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

<style>
.svg-icon {
  margin-right: 0.5rem;
}
</style>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}

.mb-1 {
  margin-bottom: 1rem !important;
}
</style>
