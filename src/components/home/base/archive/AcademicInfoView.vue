<script setup lang="ts">
import type { ForeignLanguageBase, PrecautionBase } from '@/model/studentModel'
import { computed } from 'vue'

const academicInfo = defineModel<{
  foreignLanguages: ForeignLanguageBase[]
  precautions: PrecautionBase[]
}>()

const sortedLanguages = computed(() =>
  [...(academicInfo.value?.foreignLanguages ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
)

const sortedPrecautions = computed(() =>
  [...(academicInfo.value?.precautions ?? [])].sort((a, b) => a.term.localeCompare(b.term))
)

const levelText = (levelCode: string) => {
  if (levelCode === '0') return '红色预警'
  else if (levelCode === '1') return '橙色预警'
  else return '黄色预警'
}

const detailText = (rawDetail: string) => {
  console.log(rawDetail.split('\n'))
  return rawDetail.split('\n')
}
</script>

<template>
  <v-container fluid>
    <!-- 外语成绩 -->
    <v-card class="mb-4">
      <v-card-title class="text-center">外语成绩</v-card-title>
      <v-card-text>
        <v-list v-if="sortedLanguages.length > 0" class="pt-0 pb-0">
          <template v-for="(lang, index) in sortedLanguages" :key="'lang-' + index">
            <v-list-item class="py-3">
              <v-list-item-content>
                <v-list-item-title> {{ lang.languageName }}（{{ lang.type }}） </v-list-item-title>
                <div class="text-body-2 text-grey-darken-1">
                  成绩：{{ lang.score }} ｜ 考试学期：{{ lang.date }}
                </div>
                <div class="text-body-2 text-grey-darken-1">证书编号：{{ lang.certificate }}</div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index < sortedLanguages.length - 1" />
          </template>
        </v-list>
        <div v-else class="text-grey">暂无外语成绩记录</div>
      </v-card-text>
    </v-card>

    <!-- 学业预警信息 -->
    <v-card>
      <v-card-title class="text-center">学业预警信息</v-card-title>
      <v-card-text>
        <v-list v-if="sortedPrecautions.length > 0" class="pt-0 pb-0">
          <template v-for="(p, index) in sortedPrecautions" :key="'precaution-' + index">
            <v-list-item class="py-3">
              <v-list-item-content>
                <v-list-item-title>
                  学期：{{ p.term }} ｜ 预警等级：{{ levelText(p.levelCode) }}
                </v-list-item-title>
                <div class="text-body-2 text-grey-darken-1">
                  情况说明：
                  <li :key="idx" v-for="(text, idx) in detailText(p.detail)">
                    {{ text }}
                  </li>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index < sortedPrecautions.length - 1" />
          </template>
        </v-list>
        <div v-else class="text-grey">暂无学业预警信息</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.text-grey {
  color: #9e9e9e;
  padding: 8px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
