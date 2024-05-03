<script lang="ts" setup>
import { ref } from 'vue'
import { apiAddCompetition, apiUpdateCompetition, type Competition } from '@/api/competition'
import { notify } from '@kyvg/vue3-notification'

import CompetitionLevelSelect from './CompetitionLevelSelect.vue';
import CompetitionNatureSelect from './CompetitionNatureSelect.vue';

const dialog = defineModel<boolean>()
const model = defineModel<Competition>('info', { required: true })
const type = defineModel<"add" | "edit">('type', { required: true })
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const form = ref(false)

const updateCompetitionLogic = async () => {
  const { data: result } = await apiUpdateCompetition(model.value)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '竞赛信息修改成功！' })
  loading.value = false
}
const addCompetitionLogic = async () => {
  const { data: result } = await apiAddCompetition(model.value)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '竞赛信息添加成功！' })
  loading.value = false
}

const submitHandler = async () => {
  if (type.value === 'add') {
    await addCompetitionLogic()
  } else {
    await updateCompetitionLogic()
  }
  emits('onClosed')
}

</script>

<template>
  <v-dialog v-model="dialog" width="400">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-pencil" title="竞赛信息">
      <v-container class="px-8">
        <v-form v-model="form" class="text-indigo">
          <v-text-field label="竞赛名称" color="indigo" v-model="model.competitionName" clearable required
            :rules="[() => !!model.competitionName || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>
          <CompetitionNatureSelect v-model="model.competitionNature" class="mb-6">
            <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
          </CompetitionNatureSelect>
          <CompetitionLevelSelect v-model="model.competitionLevel">
            <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
          </CompetitionLevelSelect>

        </v-form>
      </v-container>

      <v-divider></v-divider>

      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn :disabled="!form" text="下一步" :loading="loading" color="indigo" variant="plain"
          @click="submitHandler"></v-btn>
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>
