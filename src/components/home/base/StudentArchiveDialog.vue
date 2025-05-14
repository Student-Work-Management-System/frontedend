<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type {
  AcademicWorkBase,
  CompetitionBase,
  ForeignLanguageBase,
  PrecautionBase,
  PunishmentBase,
  ScholarshipBase,
  StudentArchive
} from '@/model/studentModel'
import EnrollmentView from '@/components/home/base/archive/EnrollmentView.vue'
import StatusList from '@/components/home/base/archive/StatusView.vue'
import ScholarshipPunishmentView from '@/components/home/base/archive/ScholarshipPunishmentView.vue'
import PovertyAssistanceList from '@/components/home/base/archive/PovertyAssistanceView.vue'
import AcademicInfoView from '@/components/home/base/archive/AcademicInfoView.vue'
import AchievementView from '@/components/home/base/archive/AchievementView.vue'

const tab = ref(0)
const dialog = defineModel<boolean>('archiveDialog')
const archive = defineModel<StudentArchive | null>('archive')
const scholarshipAndPunishment = reactive({
  scholarships: [] as ScholarshipBase[],
  punishments: [] as PunishmentBase[]
})
const academicInfo = reactive({
  foreignLanguages: [] as ForeignLanguageBase[],
  precautions: [] as PrecautionBase[]
})
const achivevement = reactive({
  academicWorks: [] as AcademicWorkBase[],
  competitions: [] as CompetitionBase[]
})
onMounted(() => {
  if (archive.value) {
    scholarshipAndPunishment.scholarships = archive.value.scholarships
    scholarshipAndPunishment.punishments = archive.value.punishments
    academicInfo.foreignLanguages = archive.value.foreignLanguages
    academicInfo.precautions = archive.value.precautions
    achivevement.academicWorks = archive.value.academicWorks
    achivevement.competitions = archive.value.competitions
  }
})
</script>

<template>
  <v-dialog v-model="dialog" max-width="1200">
    <v-card>
      <v-card-title>
        <span class="text-h6">学生档案</span>
      </v-card-title>
      <v-card-text class="overflow-y-auto" style="max-height: 80vh">
        <v-tabs v-model="tab">
          <v-tab :value="0">基本信息</v-tab>
          <v-tab :value="1">学籍变动记录</v-tab>
          <v-tab :value="2">奖惩信息</v-tab>
          <v-tab :value="3">资助信息</v-tab>
          <v-tab :value="4">学业信息</v-tab>
          <v-tab :value="5">成果竞赛</v-tab>
        </v-tabs>

        <v-window v-model="tab" v-if="archive">
          <v-window-item :tab="0">
            <EnrollmentView v-model="archive!!.enrollment" />
          </v-window-item>

          <v-window-item :tab="1">
            <StatusList v-model="archive!!.statuses" />
          </v-window-item>

          <v-window-item :tab="2">
            <ScholarshipPunishmentView v-model="scholarshipAndPunishment" />
          </v-window-item>

          <v-window-item :tab="3">
            <PovertyAssistanceList v-model="archive!!.povertyAssistances" />
          </v-window-item>

          <v-window-item :tab="4">
            <AcademicInfoView v-model="academicInfo" />
          </v-window-item>

          <v-window-item :tab="5">
            <AchievementView v-model="achivevement" />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-text {
  padding-top: 0;
}
</style>
