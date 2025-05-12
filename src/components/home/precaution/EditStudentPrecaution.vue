<script lang="ts" setup>
import { apiUpdateStudentPrecaution, levelOptions } from '@/api/precaution'
import type { StudentPrecaution, StudentPrecautionItem } from '@/model/precautionModel'
import { notify } from '@kyvg/vue3-notification'
import { ref, watchEffect } from 'vue'

const model = defineModel<boolean>()
const info = defineModel<StudentPrecautionItem>('info')
const localInfo = ref<StudentPrecautionItem>()

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
  const { data: result } = await apiUpdateStudentPrecaution(localInfo.value! as StudentPrecaution)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  loading.value = false
  emits('onClosed')
}
</script>

<template>
  <v-dialog width="auto" min-width="600" v-model="model">
    <v-card title="编辑学业预警信息">
      <v-container>
        <v-form v-model="form" class="px-6">
          <!-- 可编辑项 -->
          <v-select
            class="text-indigo"
            label="预警等级"
            v-model="localInfo!.levelCode"
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
            v-model="localInfo!.term"
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
            v-model="localInfo!.detail"
            variant="filled"
            required
          />
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn color="primary" :disabled="!form" @click="updateInfoLogic" text="保存" />
        <v-btn @click="onCancel" text="取消" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
