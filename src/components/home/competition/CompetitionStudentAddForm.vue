<script lang="ts" setup>
import { ref, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { apiAddStudentOwnCompetition, type Competition } from '@/api/competition'
import { apiUploadFile } from '@/api/file'
import CompetitionsSelect from '@/components/home/competition/CompetitionsSelect.vue'
const dialog = defineModel<boolean>()
const userId = defineModel<string>('userId', { required: true })
const emits = defineEmits(['onClosed'])

const loading = ref(false)
const form = ref(false)
const step = ref(1)
const files = ref<File[]>([])
const selectCompetition = ref<Competition>()
const showMultiChips = computed(() => selectCompetition.value?.competitionNature !== undefined && selectCompetition.value?.competitionNature === '团队')

const awardDate = ref<Date>(new Date())
const awardLevel = ref('')

const chips = ref<{ username: string, realname: string }[]>([])

const nextStepHandler = () => {
  if (isNaN(Number(userId.value))) {
    notify({ type: 'warn', title: '提示', text: "当前用户无法使用上报！" })
    return
  }
  step.value++
}

const submitHandler = async () => {
  loading.value = true
  const { data: result } = await apiUploadFile("competition", files.value[0])
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }

  let link = result.data;
  const { data: result2 } = await apiAddStudentOwnCompetition({
    competitionId: selectCompetition.value?.competitionId as string,
    headerId: userId.value,
    evidence: link,
    awardDate: awardDate.value.toISOString().split('T')[0],
    awardLevel: awardLevel.value,
    members: chips.value.map((c, idx) => ({ studentId: c.username, realName: c.realname, order: idx + 1 }))
  })
  if (result2.code !== 200) {
    notify({ type: 'error', title: '错误', text: result2.message })
    loading.value = false
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '获奖记录添加成功！' })
  emits('onClosed')
}

</script>
<template>
  <v-dialog v-model="dialog" width="600">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-upload" title="上传获奖记录">
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-container class="px-8">
            <v-form v-model="form" class="form text-indigo">
              <v-text-field label="填报人学号" color="indigo" v-model="userId" prepend-inner-icon="mdi-head" readonly
                hide-details>
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>

              <MultiInputUserChips class="ml-4 w-100" v-model="chips" v-model:show="showMultiChips">
                <v-icon size="smaller" color="#cf6578" icon="mdi-asterisk"></v-icon>
              </MultiInputUserChips>

              <CompetitionsSelect v-model="selectCompetition">
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
              </CompetitionsSelect>

              <AwardLevelSelect v-model="awardLevel">
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
              </AwardLevelSelect>

              <DateSelect v-model="awardDate" label="获奖日期">
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
              </DateSelect>

            </v-form>
          </v-container>
          <v-divider></v-divider>

          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn :disabled="!form || selectCompetition === undefined || selectCompetition?.competitionNature === '团队' &&
              chips.length <= 0" text="下一步" :loading="loading" color="indigo" variant="plain"
              @click="nextStepHandler"></v-btn>
            <v-btn text="取消" variant="plain" @click="(step = 1), (dialog = false)"></v-btn>
          </v-container>
        </v-window-item>
        <v-window-item :value="2">
          <v-container class="px-8 ">
            <v-file-input v-model="files" class="text-indigo" color="indigo" variant="outlined" counter show-size
              free-select label="证明材料 文件选择"></v-file-input>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn :disabled="!form || selectCompetition === null || selectCompetition?.competitionNature === '团队' &&
              chips.length <= 0 || files!.length <= 0" text="提交" :loading="loading" color="indigo" variant="plain"
              @click="submitHandler"></v-btn>
            <v-btn text="取消" variant="plain" @click="(step = 1), (dialog = false)"></v-btn>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>


<style scoped>
.form>* {
  margin-bottom: 0.5rem;
}
</style>
