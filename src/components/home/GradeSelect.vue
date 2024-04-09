<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref } from 'vue'

const model = defineModel<string>()
const items = ref<string[]>([])
const since = 2017
const nowYear = new Date().getFullYear()
items.value = Array.from({ length: nowYear - since + 1 }, (_, index) => (since + index).toString())
items.value.push('')
items.value = items.value.reverse()

onMounted
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="年级"
    :items="items"
    variant="underlined"
    hide-details
  ></v-select>
</template>
