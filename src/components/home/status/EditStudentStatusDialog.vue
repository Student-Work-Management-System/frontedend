<script lang="ts" setup>
import { apiUpdateStudentStatus } from '@/api/status'
import type { StudentStatus, StudentStatusItem } from '@/model/statusModel'
import { notify } from '@kyvg/vue3-notification'
import { ref, watchEffect } from 'vue'
import StatusSelect from '../StatusSelect.vue'

const model = defineModel<boolean>()
const info = defineModel<StudentStatusItem>('info')
const localInfo = ref<StudentStatusItem>()
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
  try {
    loading.value = true
    const { data: result } = await apiUpdateStudentStatus(localInfo.value as StudentStatus)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: '更新成功！' })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    emits('onClosed')
  }
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-card width="auto" prepend-icon="mdi-account-edit" :title="localInfo!.name + '学籍状态'">
      <v-container>
        <v-form v-model="form" class="px-8">
          <StatusSelect v-model="localInfo!.statusId" variant="underlined" class="mb-4" />
          <v-textarea
            v-model="localInfo!.log"
            color="indigo"
            label="变动记录"
            class="text-indigo"
          />
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
