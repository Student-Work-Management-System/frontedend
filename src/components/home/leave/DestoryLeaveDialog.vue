<script lang="ts" setup>
import { ref } from 'vue'

const dialog = defineModel<boolean>()
const emits = defineEmits(['destory'])
const loading = ref(false)

const destoryHandler = () => {
  emits('destory')
  dialog.value = false
}
</script>
<template>
  <v-dialog width="500" v-model="dialog">
    <v-card prepend-icon="mdi-delete" title="销假提醒" :text="`确定销假`">
      <v-card-actions class="mx-auto">
        <v-btn :loading="loading" color="error" @click="destoryHandler" text="确定" />
        <v-btn @click="dialog = false" text="取消" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
