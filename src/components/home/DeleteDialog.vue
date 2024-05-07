<script lang="ts" setup>
import { ref } from 'vue'

const model = defineModel<boolean>()
const selectedLength = defineModel<number>('length')
const emits = defineEmits(['delete'])
const loading = ref(false)

const deleteHandler = () => {
  loading.value = true
  emits('delete')
  loading.value = false
}
</script>
<template>
  <v-dialog width="500" v-model="model">
    <v-card prepend-icon="mdi-delete" title="删除选择" :text="`已选择 ${selectedLength} 条记录，本操作不可撤回，确定要删除吗？`">
      <v-card-actions class="mx-auto">
        <v-btn :loading="loading" :disabled="selectedLength === 0" color="error" @click="deleteHandler">删除</v-btn>
        <v-btn @click="model = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
