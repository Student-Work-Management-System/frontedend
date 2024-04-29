<script lang="ts" setup>
import { apiUpdatePovertyAssistance, getPovertyLevels, type PovertyAssistance } from '@/api/poverty'
import { watchEffect } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { reactive } from 'vue'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const props = defineProps<{ info: PovertyAssistance }>()
const loading = ref(false)
const povertyInfo = reactive({
  povertyAssistanceId: '',
  povertyLevel: '',
  povertyType: '',
  povertyAssistanceStandard: ''
})
const povertyLevels = getPovertyLevels()
const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdatePovertyAssistance({
    ...povertyInfo
  })
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}

watchEffect(() => {
  povertyInfo.povertyAssistanceId = props.info.povertyAssistanceId
  povertyInfo.povertyLevel = props.info.povertyLevel
  povertyInfo.povertyType = props.info.povertyType
  povertyInfo.povertyAssistanceStandard = props.info.povertyAssistanceStandard
})
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-content-save-edit-outline" title="职位信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="贫困类型"
                v-model="povertyInfo.povertyType"
                :counter="20"
                required
                :rules="[() => !!povertyInfo.povertyType || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-select
                label="贫困等级"
                v-model="povertyInfo.povertyLevel"
                :items="povertyLevels"
                :rules="[() => !!povertyInfo.povertyLevel || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-select>

              <v-text-field
                label="资助标准"
                v-model="povertyInfo.povertyAssistanceStandard"
                :counter="20"
                required
                :rules="[() => !!povertyInfo.povertyAssistanceStandard || '该选项必填！']"
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
            ></v-btn>
            <v-btn text="取消" @click="model = false" variant="plain"></v-btn>
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
