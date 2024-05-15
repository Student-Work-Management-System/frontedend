<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<boolean>()
const selectedLength = defineModel<number>('length')
const emits = defineEmits(['onAudit'])


const step = ref(1)
const loading = ref(false)
const selectAuditStatus = ref('')
const auditReason = ref('')

const auditHandler = () => {
  loading.value = true
  emits('onAudit', selectAuditStatus.value, auditReason.value)
  loading.value = false
}


</script>
<template>
  <v-dialog width="500" v-model="model">
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card prepend-icon="mdi-eye" title="多选审核" :text="`已选择 ${selectedLength} 条记录，本操作不可撤回，确定要审核吗？`">
          <v-divider></v-divider>

          <v-card-actions class="w-100 d-flex justify-space-evenly">
            <v-btn variant="plain" :loading="loading" :disabled="selectedLength === 0" color="indigo" @click="step++">确
              定</v-btn>
            <v-btn variant="plain" @click="step = 1, model = false">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
        <v-card prepend-icon="mdi-eye" title="多选审核">
          <v-container class="w-100 d-flex justify-space-evenly">
            <section class="w-100 px-8">
              <CompetitionAuditSelect v-model="selectAuditStatus" v-model:reason="auditReason" />
              <v-textarea v-model="auditReason" color="indigo" class="text-indigo mt-4"
                v-show="selectAuditStatus === '已拒绝'" label="拒绝理由"></v-textarea>
            </section>
          </v-container>
          <v-card-actions class="w-100 d-flex justify-space-evenly">
            <v-btn variant="plain" :loading="loading" :disabled="selectAuditStatus === '拒绝' && auditReason!.length <= 0"
              color="indigo" @click="auditHandler">提 交</v-btn>
            <v-btn variant="plain" @click="step = 1, model = false">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>
