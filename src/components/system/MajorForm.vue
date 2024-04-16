<script lang="ts" setup>
import { apiAddMajor, apiUpdateMajor, type Major } from '@/api/major'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { computed } from 'vue'
const dialog = defineModel<boolean>()
const infoModel = defineModel<Major>('info')
const openType = defineModel<'edit' | 'add'>('type')
const emits = defineEmits(['onClosed'])

const loading = ref(false)
const cardTitle = computed(() => ((openType.value! as string) === 'edit' ? '编辑专业' : '添加专业'))

const addMajorLogic = async () => {
  loading.value = true
  const { data: result } = await apiAddMajor({ ...infoModel.value! })
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  loading.value = false
  emits('onClosed')
}

const updateMajorLogic = async () => {
  const { data: result } = await apiUpdateMajor({ ...infoModel.value! })
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '修改成功！' })
  loading.value = false
  emits('onClosed')
}

const submitHandler = computed(() =>
  (openType.value! as string) === 'edit' ? updateMajorLogic : addMajorLogic
)
</script>
<template>
  <v-dialog v-model="dialog" width="500">
    <v-card :title="cardTitle">
      <v-container class="px-8 text-indigo">
        <v-text-field
          label="专业名称"
          color="indigo"
          v-model="infoModel!.majorName"
          clearable
        ></v-text-field>
      </v-container>

      <v-divider></v-divider>
      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn
          :disabled="infoModel?.majorName === undefined || infoModel?.majorName.length <= 0"
          text="提交"
          :loading="loading"
          color="indigo"
          variant="plain"
          @click="submitHandler()"
        ></v-btn>
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>
