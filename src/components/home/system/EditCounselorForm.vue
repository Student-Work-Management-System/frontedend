<script lang="ts" setup>
import { type CounselorItem } from '@/model/otherModel'
const emits = defineEmits(['onClosed'])
const info = defineModel<CounselorItem>('info')
const model = defineModel<boolean>()
</script>

<template>
  <v-card></v-card>
</template>
