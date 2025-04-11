<script lang="ts" setup>
import CompetitionNatureSelect from './CompetitionNatureSelect.vue'
import CompetitionTypeSelect from './CompetitionTypeSelect.vue'
import { apiAddCompetition } from '@/api/competition'
import type { Competition } from '@/model/competitionModel'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { reactive } from 'vue'
const emits = defineEmits(['onClosed'])

const form = ref(false)
const loading = ref(false)
const model = defineModel<boolean>()

const newCompetition = reactive<Competition>({
  competitionName: '',
  competitionNature: '',
  competitionType: '',
  comment: ''
})

const AddCompetitionLogic = async () => {
  loading.value = true
  const { data: result } = await apiAddCompetition(newCompetition as Competition)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  emits('onClosed')
  clearCompetitionInfo()
  loading.value = false
}

const clearCompetitionInfo = () => {
  newCompetition.competitionName = ''
  newCompetition.competitionNature = ''
  newCompetition.competitionType = ''
  newCompetition.comment = ''
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-vector-arrange-below" title="竞赛信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="竞赛名称"
                v-model="newCompetition.competitionName"
                class="text-indigo"
                color="indigo"
                required
                :rules="[() => !!newCompetition.competitionName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <CompetitionNatureSelect class="mb-6" v-model="newCompetition.competitionNature">
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </CompetitionNatureSelect>
              <CompetitionTypeSelect class="mb-6" v-model="newCompetition.competitionType">
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </CompetitionTypeSelect>
              <v-text-field
                label="备注"
                v-model="newCompetition.comment"
                class="text-indigo"
                color="indigo"
              />
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form"
              text="确定"
              color="indigo"
              @click="AddCompetitionLogic"
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
