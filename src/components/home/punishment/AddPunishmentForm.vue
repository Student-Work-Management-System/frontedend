<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { apiAddPunishmentItem } from '@/api/punishment'
import type { Punishment } from '@/model'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])

const form = ref(false)
const loading = ref(false)

const newPunishment = reactive<Punishment>({
  punishmentName: ''
})

const addPunishmentLogic = async () => {
  loading.value = true
  const { data: result } = await apiAddPunishmentItem(newPunishment)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  emits('onClosed')
  clearPunishmentInfo()
  loading.value = false
}

const clearPunishmentInfo = () => {
  newPunishment.punishmentName = ''
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-vector-arrange-below" title="添加处分条目">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="处分名称"
                class="text-indigo"
                v-model="newPunishment.punishmentName"
                :counter="50"
                required
                :rules="[() => !!newPunishment.punishmentName || '该选项必填！']"
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
              @click="addPunishmentLogic"
              variant="plain"
            ></v-btn>
            <v-btn text="取消" @click="model = false" variant="plain"></v-btn>
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
