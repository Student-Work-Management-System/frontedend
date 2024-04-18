<script lang="ts" setup>
import { ref } from 'vue'

const model = defineModel<boolean>()
const length = defineModel<number>('length')
const emits = defineEmits(['upload'])
const loading = ref(false)

const uploadHandler = () => {
  loading.value = true
  emits('upload')
  loading.value = false
}

</script>
<template>
  <v-dialog width="500" v-model="model">
    <v-card prepend-icon="mdi-upload" title="上传数据" :text="`填写选择 ${length} 条记录，确定要上传吗？`">
      <v-card-actions class="mx-auto">
        <v-btn :loading="loading" :disabled="length === 0" color="indigo" @click="uploadHandler">上传</v-btn>
        <v-btn @click="model = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
