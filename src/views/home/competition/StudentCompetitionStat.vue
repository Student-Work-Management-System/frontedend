<script setup lang="ts">
import { apiGetStat } from '@/api/competition'
import type { CompetitionStatQuery, CompetitionStatGroup } from '@/model/competitionModel'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { reactive, ref, onMounted } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const query = reactive<CompetitionStatQuery>({
  gradeId: null,
  majorId: null
})
const loading = ref(false)
const items = ref<CompetitionStatGroup[]>([])

const getStat = async () => {
  loading.value = true
  try {
    const { data: result } = await apiGetStat(query)
    if (result.code !== 200) {
      notify({ type: 'error', text: result.message })
      return
    }
    items.value = result.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
onMounted(getStat)

const getCompetitionBelongs = (group: CompetitionStatGroup) => {
  const belongs = new Set<string>() // 单人 / 团队
  group.majors.forEach((major) => {
    major.types.forEach((typeGroup) => {
      belongs.add(typeGroup.type)
    })
  })
  return Array.from(belongs)
}

const getCompetitionEvents = (group: CompetitionStatGroup, type: string) => {
  const events = new Set<string>()
  group.majors.forEach((major) => {
    major.types
      .filter((t) => t.type === type)
      .forEach((typeGroup) => {
        typeGroup.competitions.forEach((comp) => {
          events.add(comp.competitionTotalName)
        })
      })
  })
  return Array.from(events)
}

const getAwardLevels = (group: CompetitionStatGroup, type: string, competition: string) => {
  const levels = new Set<string>()
  group.majors.forEach((major) => {
    major.types
      .filter((t) => t.type === type)
      .forEach((typeGroup) => {
        typeGroup.competitions
          .filter((c) => c.competitionTotalName === competition)
          .forEach((comp) => {
            comp.levels.forEach((level) => {
              levels.add(level.level)
            })
          })
      })
  })
  return Array.from(levels)
}

const generateTableData = (group: CompetitionStatGroup) => {
  const rows: any[] = []
  group.majors.forEach((major) => {
    const row: any = { majorName: major.majorId }
    major.types.forEach((typeGroup) => {
      typeGroup.competitions.forEach((comp) => {
        comp.levels.forEach((level) => {
          const key = `${typeGroup.type}_${comp.competitionTotalName}_${level.level}`
          row[key] = level.count
        })
      })
    })
    rows.push(row)
  })
  return rows
}
</script>

<template>
  <v-card elevation="10" class="card-container" width="100%" height="100%">
    <section class="menu mb-2">
      <span class="w-15">
        <GradeSelect v-model="query.gradeId" :chargeGrades="chargeGrades" variant="underlined" />
      </span>
      <span class="w-15">
        <MajorSelect v-model="query.majorId" variant="underlined" />
      </span>
      <v-btn prepend-icon="mdi-refresh" @click="getStat" text="刷新" />
    </section>

    <section style="overflow-y: auto; height: 100%">
      <template v-if="items.length > 0">
        <v-card v-for="group in items" :key="group.gradeName" class="pa-2 mb-2">
          <v-card-title>{{ group.gradeName }}</v-card-title>
          <el-table :data="generateTableData(group)" border>
            <el-table-column prop="majorName" label="专业名称" width="175" fixed align="center" />
            <template v-for="type in getCompetitionBelongs(group)" :key="type">
              <el-table-column :label="type" align="center">
                <template
                  v-for="event in getCompetitionEvents(group, type)"
                  :key="`${type}_${event}`"
                >
                  <el-table-column :label="event" align="center">
                    <el-table-column
                      v-for="level in getAwardLevels(group, type, event)"
                      :key="`${type}_${event}_${level}`"
                      :prop="`${type}_${event}_${level}`"
                      :label="level"
                      align="center"
                      :min-width="60"
                    />
                  </el-table-column>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </v-card>
      </template>
      <v-card v-else class="w-100 d-flex justify-center align-center" style="height: 200px">
        <v-card-title>暂无数据</v-card-title>
      </v-card>
    </section>
  </v-card>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}
.menu > * {
  margin-right: 0.5rem;
}
.w-15 {
  width: 15% !important;
}
</style>
