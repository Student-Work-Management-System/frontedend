<script lang="ts" setup>
import { ref, reactive, watchEffect } from 'vue'
import { apiUpdatePunishmentItem } from '@/api/punishment'
import type { Punishment } from '@/model/punishmentModel'
import { notify } from '@kyvg/vue3-notification'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const props = defineProps<{ info: Punishment }>()
const loading = ref(false)

const punishmentInfo = reactive({
  punishmentId: '',
  punishmentName: ''
})

const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdatePunishmentItem(punishmentInfo)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}

watchEffect(() => {
  punishmentInfo.punishmentId = props.info.punishmentId!!
  punishmentInfo.punishmentName = props.info.punishmentName
})
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-content-save-edit-outline" title="处分条目编辑">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="处分名称"
                class="text-indigo"
                v-model="punishmentInfo.punishmentName"
                :counter="50"
                required
                :rules="[() => !!punishmentInfo.punishmentName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
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

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
