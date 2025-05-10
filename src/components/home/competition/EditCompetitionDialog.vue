<script lang="ts" setup>
import { apiUpdateCompetition } from '@/api/competition'
import { notify } from '@kyvg/vue3-notification'
import { computed, ref } from 'vue'
import type { Competition } from '@/model/competitionModel'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const info = defineModel<Competition>('info')
const modifyInfo = computed(() => {
  return {
    competitionId: info.value!.competitionId,
    competitionName: info.value!.competitionName,
    subCompetitionName: info.value!.subCompetitionName,
    competitionNature: info.value!.competitionNature,
    competitionType: info.value!.competitionType
  }
})
const loading = ref(false)
const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateCompetition(modifyInfo.value)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-content-save-edit-outline" title="竞赛信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="竞赛名称"
                class="text-indigo"
                v-model="modifyInfo.competitionName"
                :counter="20"
                required
                :rules="[() => !!modifyInfo.competitionName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-text-field
                label="竞赛子名称"
                class="text-indigo"
                v-model="modifyInfo.subCompetitionName"
              />
              <CompetitionNatureSelect class="mb-6" v-model="modifyInfo.competitionNature">
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </CompetitionNatureSelect>
              <CompetitionTypeSelect class="mb-6" v-model="modifyInfo.competitionType">
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </CompetitionTypeSelect>
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
