<script lang="ts" setup>
import { apiAddScholarships, scholarshipLevels } from '@/api/scholarship'
import type { Scholarship } from '@/model/scholarshipModel'
import { notify } from '@kyvg/vue3-notification'
import { ref, reactive } from 'vue'
const emits = defineEmits(['onClosed'])

const form = ref(false)
const loading = ref(false)
const model = defineModel<boolean>()

const newScholarship = reactive<Scholarship>({
  scholarshipName: '',
  scholarshipLevel: ''
})

const addScholarship = async () => {
  loading.value = true
  try {
    const { data: result } = await apiAddScholarships(newScholarship)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    emits('onClosed')
    clear()
  }
}

const clear = () => {
  newScholarship.scholarshipName = ''
  newScholarship.scholarshipLevel = ''
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
                label="奖学金名称"
                v-model="newScholarship.scholarshipName"
                :counter="20"
                required
                :rules="[() => !!newScholarship.scholarshipName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-select
                label="奖学金等级"
                v-model="newScholarship.scholarshipLevel"
                :items="scholarshipLevels"
                :rules="[() => !!newScholarship.scholarshipLevel || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-select>
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form"
              text="确定"
              color="indigo"
              @click="addScholarship"
              variant="plain"
            />
            <v-btn text="取消" @click="model = false" variant="plain" />
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>
