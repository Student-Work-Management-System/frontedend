<script lang="ts" setup>
import { apiAddPovertyAssistance, getPovertyLevels } from '@/api/poverty'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { reactive } from 'vue'
const emits = defineEmits(['onClosed'])

const povertyLevels = ref<String[]>(getPovertyLevels())
const form = ref(false)
const loading = ref(false)
const model = defineModel<boolean>()

const newPoverty = reactive({
  povertyLevel: '',
  povertyType: '',
  povertyAssistanceStandard: ''
})

const AddPovertyLogic = async () => {
  loading.value = true
  const { data: result } = await apiAddPovertyAssistance(newPoverty)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  emits('onClosed')
  ClearPovertyInfo()
  loading.value = false
}

const ClearPovertyInfo = () => {
  newPoverty.povertyLevel = ''
  newPoverty.povertyType = ''
  newPoverty.povertyAssistanceStandard = ''
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-vector-arrange-below" title="贫困类型信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="贫困类型"
                v-model="newPoverty.povertyType"
                :counter="20"
                required
                :rules="[() => !!newPoverty.povertyType || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-select
                label="贫困等级"
                v-model="newPoverty.povertyLevel"
                :items="povertyLevels"
                :rules="[() => !!newPoverty.povertyLevel || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-select>

              <v-text-field
                label="资助标准"
                v-model="newPoverty.povertyAssistanceStandard"
                :counter="20"
                required
                :rules="[() => !!newPoverty.povertyAssistanceStandard || '该选项必填！']"
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
              @click="AddPovertyLogic"
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
