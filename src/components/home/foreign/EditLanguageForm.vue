<script lang="ts" setup>
import { apiUpdateLanguage } from '@/api/foreign'
import { computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import type { Language } from '@/model/foreignModel'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const info = defineModel<Language>('info')
const form = ref(false)
const loading = ref(false)
const modifyInfo = computed(() => {
  return {
    languageId: info.value!.languageId,
    languageName: info.value!.languageName,
    type: info.value!.type,
    total: info.value!.total
  }
})

const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateLanguage(modifyInfo.value)
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
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-pencil" title="语言信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="语言名称"
                v-model="modifyInfo.languageName"
                required
                :rules="[() => !!modifyInfo.languageName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-text-field
                label="语言类型"
                v-model="modifyInfo.type"
                required
                :rules="[() => !!modifyInfo.type || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-text-field
                label="满分"
                v-model="modifyInfo.total"
                required
                :rules="[() => !!modifyInfo.total || '该选项必填！']"
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
