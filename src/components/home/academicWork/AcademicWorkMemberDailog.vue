<script lang="ts" setup>
import type { AcademicWorkMemberItem } from '@/model/academicWorkModel'
import { ref, watchEffect } from 'vue'
const model = defineModel<boolean>()
const props = defineProps<{
  members: AcademicWorkMemberItem[]
}>()

const loading = ref(false)
const refMembers = ref<AcademicWorkMemberItem[]>([])
const emit = defineEmits(['on-close'])

const closeDialog = () => {
  emit('on-close')
}

watchEffect(() => {
  if (model.value) {
    refMembers.value = props.members
  }
})
</script>

<template>
  <v-card>
    <v-dialog v-model="model" width="600">
      <v-card>
        <v-card-title class="text-h5 d-flex align-center">
          <v-icon start icon="mdi-account-group" class="mr-2" />
          成员信息
        </v-card-title>

        <v-card-text>
          <v-list v-if="!loading && refMembers.length">
            <v-list-item
              v-for="member in refMembers"
              :key="member.username"
              :title="`${member.memberOrder} - ${member.username} - ${member.realName}`"
              :subtitle="member.isStudent ? `${member.majorName} - ${member.gradeName}` : ''"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-account" />
              </template>

              <template v-slot:append>
                <v-chip color="blue" size="small">
                  {{ member.isStudent ? '学生' : '非学生成员' }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>

          <v-progress-circular v-else-if="loading" indeterminate color="primary" class="ma-4" />

          <v-alert v-else type="info" text="暂无团队成员信息" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="closeDialog"
            prepend-icon="mdi-close"
            text="关闭"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.v-list-item {
  margin-bottom: 8px;
  border-radius: 4px;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-primary), 0.1);
}
</style>
