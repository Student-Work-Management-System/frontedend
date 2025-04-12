<script setup lang="ts">
import { ref } from 'vue'
import CompetitionAuditSelect from '@/components/home/competition/StateSelect.vue'

const model = defineModel<boolean>()
const selectedLength = defineModel<number>('length')
const emits = defineEmits(['update'])

const step = ref(1)
const loading = ref(false)
const reason = ref('')
const state = ref('')

const auditHandler = () => {
  loading.value = true
  emits('update', state.value, reason.value)
  loading.value = false
}
</script>
<template>
  <v-dialog width="500" v-model="model">
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card
          prepend-icon="mdi-eye"
          title="多选审核"
          :text="`已选择 ${selectedLength} 条记录，本操作不可撤回，确定要审核吗？`"
        >
          <v-divider></v-divider>

          <v-card-actions class="w-100 d-flex justify-space-evenly">
            <v-btn
              variant="plain"
              :loading="loading"
              :disabled="selectedLength === 0"
              color="indigo"
              @click="step++"
              text="确定"
            />
            <v-btn variant="plain" @click="(step = 1), (model = false)" text="取消" />
          </v-card-actions>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
        <v-card prepend-icon="mdi-eye" title="多选审核">
          <v-container class="w-100 d-flex justify-space-evenly">
            <section class="w-100 px-8">
              <CompetitionAuditSelect v-model="state" :show-waiting="false" />
              <v-textarea
                v-model="reason"
                color="indigo"
                class="text-indigo mt-4"
                v-show="state === '拒绝'"
                label="驳回理由"
              />
            </section>
          </v-container>
          <v-card-actions class="w-100 d-flex justify-space-evenly">
            <v-btn
              variant="plain"
              :loading="loading"
              :disabled="state === '拒绝' && reason.length <= 0"
              color="indigo"
              @click="auditHandler"
              text="提 交"
            />
            <v-btn variant="plain" @click="(step = 1), (model = false)" text="取消" />
          </v-card-actions>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>
