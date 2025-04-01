<script lang="ts" setup>
import { ref } from 'vue'

const dialog = defineModel<boolean>()
const selectedLength = defineModel<number>('length')
const emits = defineEmits(['delete'])
const loading = ref(false)

const deleteHandler = () => {
  loading.value = true
  emits('delete')
  loading.value = false
  dialog.value = false
}
</script>
<template>
  <v-dialog width="500" v-model="dialog">
    <v-card
      prepend-icon="mdi-delete"
      title="删除选择"
      :text="`已选择 ${selectedLength} 条记录，本操作不可撤回，确定要删除吗？`"
    >
      <v-card-actions class="mx-auto">
        <v-btn
          :loading="loading"
          :disabled="selectedLength === 0"
          color="error"
          @click="deleteHandler"
          text="删除"
        />
        <v-btn @click="dialog = false" text="取消" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
