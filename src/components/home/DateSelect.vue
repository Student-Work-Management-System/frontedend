<script lang="ts" setup>
import { ref, computed } from 'vue'
const model = defineModel<Date | null>()
const showModelText = computed(() => model.value && new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(model.value))
const props =
  withDefaults(defineProps<{
    label: string,
    variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
  }>(), { label: "日期选择" })

const selectedDate = ref<Date>()
const loading = ref(false)
const dialog = ref(false)
const submitSelectHandler = () => {
  model.value = selectedDate.value
  dialog.value = false
}

</script>
<template>
  <v-text-field :label="props.label" v-model="showModelText" :variant="props.variant"
    prepend-inner-icon="mdi-calendar-range" readonly hide-details clearable @click="dialog = true"
    @click:clear="model = null">
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-text-field>
  <v-dialog width="500" v-model="dialog" class="pa-10">
    <v-card prepend-icon="mdi-calendar-range" :title="props.label">
      <VDatePicker width="500" color="indigo" v-model="selectedDate" :title="props.label" header="选择日期" />
      <v-card-actions class="mx-auto">
        <v-btn color="indigo" :loading="loading" @click="submitSelectHandler">确定</v-btn>
        <v-btn @click="dialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

