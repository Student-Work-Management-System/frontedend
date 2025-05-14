<script setup lang="ts">
import type { AcademicWorkBase, CompetitionBase } from '@/model/studentModel'
import { computed } from 'vue'

const achivevement = defineModel<{
  academicWorks: AcademicWorkBase[]
  competitions: CompetitionBase[]
}>()

// 可选排序：按时间或名称（示例未排序，可扩展）
const academicWorks = computed(() => achivevement.value?.academicWorks ?? [])
const competitions = computed(() => achivevement.value?.competitions ?? [])
</script>

<template>
  <v-container fluid>
    <!-- 学术作品 -->
    <v-card class="mb-4">
      <v-card-title>学术著作</v-card-title>
      <v-card-text>
        <v-list v-if="academicWorks.length > 0" class="pt-0 pb-0">
          <template v-for="(work, index) in academicWorks" :key="'work-' + index">
            <v-list-item class="py-3">
              <v-list-item-content>
                <v-list-item-title> {{ work.workName }}（{{ work.type }}） </v-list-item-title>
                <div class="text-body-2 text-grey-darken-1">
                  成员：{{ work.team.map((m) => m.realName).join('，') }}
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  佐证材料：{{ work.evidence || '无' }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index < academicWorks.length - 1" />
          </template>
        </v-list>
        <div v-else class="text-grey">暂无学术著作记录</div>
      </v-card-text>
    </v-card>

    <!-- 竞赛成绩 -->
    <v-card>
      <v-card-title>竞赛成绩</v-card-title>
      <v-card-text>
        <v-list v-if="competitions.length > 0" class="pt-0 pb-0">
          <template v-for="(c, index) in competitions" :key="'competition-' + index">
            <v-list-item class="py-3">
              <v-list-item-content>
                <v-list-item-title>
                  {{ c.competitionName }}（{{ c.subCompetitionName || '主赛道' }}）
                </v-list-item-title>
                <div class="text-body-2 text-grey-darken-1">
                  类型：{{ c.competitionType }} ｜ 性质：{{ c.competitionNature }} ｜ 时间：{{
                    c.date
                  }}
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  获奖等级：{{ c.level }} ｜ 队长：{{ c.headerName }}
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  <div v-if="c.team.length > 0">
                    队伍成员：
                    <li v-for="(member, idx) in c.team" :key="'member-' + idx">
                      {{ member.studentId }} - {{ member.name }} - {{ member.gradeName }} -
                      {{ member.majorName }}
                    </li>
                  </div>
                  <div v-else>暂无队伍成员信息</div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index < competitions.length - 1" />
          </template>
        </v-list>
        <div v-else class="text-grey">暂无竞赛成绩记录</div>
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
