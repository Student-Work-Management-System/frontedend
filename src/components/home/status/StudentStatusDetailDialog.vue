<script lang="ts" setup>
import type { StudentStatusItem } from '@/model/statusModel'
import { apiGetStudentStatusDetail } from '@/api/status'
import { ref, watchEffect } from 'vue'
import { notify } from '@kyvg/vue3-notification'

const model = defineModel<boolean>()
const item = defineModel<StudentStatusItem>('item')
const emit = defineEmits(['onClose'])
const loading = ref(false)
const details = ref<StudentStatusItem[]>([])

const fetchStatusDetails = async () => {
  if (!item.value?.studentId) return

  loading.value = true
  try {
    const { data: result } = await apiGetStudentStatusDetail(item.value.studentId)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
    }
    details.value = result.data
  } catch (error) {
    console.error(error)
    notify({ type: 'error', title: '错误', text: '获取学籍记录失败' })
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (model.value) {
    fetchStatusDetails()
  }
})

const onClose = () => {
  emit('onClose')
}

const getStatusColor = (status: string) => {
  switch (status) {
    case '在籍':
      return 'primary'
    case '转入':
    case '转出':
    case '改名':
      return 'indigo'
    case '休学':
    case '保留入学资格':
    case '应征入伍保留学籍':
      return 'deep-purple'
    case '复学':
    case '毕业':
    case '结业':
      return 'blue'
    case '放弃入学资格':
    case '退学':
    case '死亡':
      return 'blue-grey'
    default:
      return 'primary'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case '在籍':
      return 'mdi-account-check'
    case '转入':
      return 'mdi-account-arrow-right'
    case '休学':
      return 'mdi-account-clock'
    case '转出':
      return 'mdi-account-arrow-left'
    case '应征入伍保留学籍':
      return 'mdi-account-star'
    case '复学':
      return 'mdi-account-reactivate'
    case '毕业':
      return 'mdi-school'
    case '放弃入学资格':
      return 'mdi-account-cancel'
    case '保留入学资格':
      return 'mdi-account-clock-outline'
    case '结业':
      return 'mdi-certificate'
    case '退学':
      return 'mdi-account-remove'
    case '改名':
      return 'mdi-account-edit'
    case '死亡':
      return 'mdi-account-off'
    default:
      return 'mdi-account'
  }
}
</script>

<template>
  <v-dialog v-model="model" width="auto" min-width="500" height="auto">
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon start icon="mdi-clipboard-text-clock" class="mr-2" />
        学籍变动总记录
      </v-card-title>

      <v-card-text>
        <div v-if="item" class="mb-4">
          <div class="student-info d-flex align-center">
            <v-icon icon="mdi-account" class="mr-2" color="primary" />
            <span class="label">学生信息: </span>
            <span class="info-text">{{ item.name }}({{ item.studentId }})</span>
          </div>
          <div class="major-info d-flex align-center mt-2">
            <v-icon icon="mdi-school" class="mr-2" color="primary" />
            <span class="label">所属院系: </span>
            <span class="info-text">{{ item.majorName }} - {{ item.gradeName }}</span>
          </div>
        </div>

        <v-list v-if="!loading && details.length">
          <v-list-item v-for="(detail, index) in details" :key="index" class="mb-2">
            <template v-slot:prepend>
              <v-icon
                :color="getStatusColor(detail.statusName)"
                :icon="getStatusIcon(detail.statusName)"
                size="x-large"
                class="status-icon"
              />
            </template>

            <div class="d-flex flex-column">
              <!-- 状态标题行 -->
              <div class="d-flex align-center">
                <span class="status-name">{{ detail.statusName }}</span>
                <v-chip size="small" variant="outlined" class="ml-4">
                  {{ detail.modifiedTime }}
                </v-chip>
              </div>

              <!-- 详细说明 -->
              <div class="mt-2 log-content">
                {{ detail.log }}
              </div>
            </div>
          </v-list-item>
        </v-list>

        <v-progress-circular v-else-if="loading" indeterminate color="primary" class="ma-4" />

        <v-alert v-else type="info" text="暂无学籍变动记录" />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="onClose"
          prepend-icon="mdi-close"
          text="关闭"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-list-item {
  border-radius: 4px;
  border: 1px solid rgba(var(--v-border-color), 0.1);
  padding: 16px;
  margin-bottom: 12px;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-primary), 0.05);
}

.status-icon {
  margin-right: 8px;
  font-size: 28px !important;
}

.status-name {
  font-size: 1.2rem;
  font-weight: 500;
}

.log-content {
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.student-info {
  font-size: 1.1rem;
}

.major-info {
  font-size: 1rem;
}

.label {
  font-weight: 500;
  margin-right: 8px;
}

.info-text {
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-chip {
  min-width: 90px;
  text-align: center;
}
</style>
