<script lang="ts" setup>
import { ref } from 'vue'
import { type Employ } from '@/api/employ'
import { apiUpdateEmploy } from '@/api/employ';
import { notify } from '@kyvg/vue3-notification'

const dialog = defineModel<boolean>()
const model = defineModel<Employ>('info', { required: true })
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const form = ref(false)

const updateEmploymentInfoLogic = async () => {
  const { data: result } = await apiUpdateEmploy(model.value)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '毕业信息修改成功！' })
  loading.value = false
  emits('onClosed')
}
</script>
<template>
  <v-dialog v-model="dialog" width="400">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-pencil" title="修改信息">
      <v-container class="px-8">
        <v-form v-model="form" class="text-indigo">
          <v-text-field label="毕业状态" color="indigo" v-model="model.graduationState" :counter="20" clearable required
            :rules="[() => !!model.graduationState || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <GradeSelect v-model="model.graduationYear" label="毕业年份" class="mb-6">
            <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
          </GradeSelect>

          <v-text-field label="毕业去向" class="ml-7" v-model="model.whereabouts" clearable> </v-text-field>
          <v-text-field label="工作性质" class="ml-7" v-model="model.jobNature" clearable> </v-text-field>
          <v-text-field label="所属行业" class="ml-7" v-model="model.jobIndustry" clearable> </v-text-field>
          <v-text-field label="工作地点" class="ml-7" v-model="model.jobLocation" clearable> </v-text-field>
          <v-text-field label="职业类别" class="ml-7" v-model="model.category" clearable> </v-text-field>
          <v-text-field label="月薪" class="ml-7" v-model="model.salary" clearable> </v-text-field>
        </v-form>
      </v-container>

      <v-divider></v-divider>

      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn :disabled="form && model.graduationYear.length <= 0" text="下一步" :loading="loading" color="indigo"
          variant="plain" @click="updateEmploymentInfoLogic"></v-btn>
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>
