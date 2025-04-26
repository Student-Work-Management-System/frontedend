<script lang="ts" setup>
import { apiAddLanguage } from '@/api/foreign'
import type { Language } from '@/model/foreignModel'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { reactive } from 'vue'

const emits = defineEmits(['onClosed'])
const form = ref(false)
const loading = ref(false)
const model = defineModel<boolean>()
const newLanguage = reactive<Language>({
  languageName: '',
  type: '',
  total: ''
})

const AddLanguageLogic = async () => {
  loading.value = true
  const { data: result } = await apiAddLanguage(newLanguage as Language)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  emits('onClosed')
  clearLanguageInfo()
  loading.value = false
}

const clearLanguageInfo = () => {
  newLanguage.languageName = ''
  newLanguage.type = ''
  newLanguage.total = ''
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-vector-arrange-below" title="职位信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="语言名称"
                class="text-indigo"
                v-model="newLanguage.languageName"
                required
                :rules="[() => !!newLanguage.languageName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-text-field
                label="语言类型"
                class="text-indigo"
                v-model="newLanguage.type"
                required
                :rules="[() => !!newLanguage.type || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-text-field
                label="满分"
                class="text-indigo"
                v-model="newLanguage.total"
                required
                :rules="[() => !!newLanguage.total || '该选项必填！']"
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
              @click="AddLanguageLogic"
              variant="plain"
            />
            <v-btn text="取消" @click="model = false" variant="plain" />
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>
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
</style>
