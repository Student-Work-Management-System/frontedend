<script lang="ts" setup>
import { apiUpdateStatus } from '@/api/status'
import { notify } from '@kyvg/vue3-notification'
import { computed, ref } from 'vue'
import type { Status } from '@/model/statusModel'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const info = defineModel<Status>('info')
const modifyInfo = computed(() => {
  return {
    statusId: info.value!.statusId,
    statusName: info.value!.statusName
  }
})
const loading = ref(false)
const updateInfoLogic = async () => {
  try {
    loading.value = true
    const { data: result } = await apiUpdateStatus(modifyInfo.value)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: '更新成功！' })
    emits('onClosed')
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-content-save-edit-outline" title="职位信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="学籍状态名"
                v-model="modifyInfo.statusName"
                :counter="20"
                required
                :rules="[() => !!modifyInfo.statusName || '该选项必填！']"
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
