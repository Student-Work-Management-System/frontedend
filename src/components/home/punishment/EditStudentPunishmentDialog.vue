<script lang="ts" setup>
import moment from 'moment'
import { apiUpdateStudentPunishment } from '@/api/punishment'
import type { StudentPunishment, StudentPunishmentItem } from '@/model/punishmentModel'
import { notify } from '@kyvg/vue3-notification'
import { ref, watchEffect } from 'vue'
import PunishtmentSelect from '@/components/home/punishment/PunishtmentSelect.vue'

const model = defineModel<boolean>()
const info = defineModel<StudentPunishmentItem>('info')
const localInfo = ref<StudentPunishmentItem>()
watchEffect(() => {
  if (model.value && info.value) {
    localInfo.value = {
      ...info.value,
      date: moment(new Date()).format('YYYY-MM-DD')
    }
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
  const { data: result } = await apiUpdateStudentPunishment(localInfo.value as StudentPunishment)
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
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-card width="auto" prepend-icon="mdi-account-alert" :title="localInfo!.name + '处分信息'">
      <v-container>
        <v-form v-model="form" class="px-8">
          <PunishtmentSelect v-model="localInfo!.punishmentId">
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </PunishtmentSelect>

          <v-text-field
            class="text-indigo mt-4"
            color="indigo"
            label="处分原因"
            v-model="localInfo!.reason"
            :counter="100"
            required
            :rules="[() => !!localInfo!.reason || '该项必填']"
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
.form > * {
  margin-bottom: 0.5rem;
}
</style>
