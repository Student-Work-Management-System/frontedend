<script lang="ts" setup>
import { ref, computed } from 'vue'
import moment from 'moment'
const model = defineModel<string | null>()
const showModelText = computed(
  () =>
    model.value &&
    new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
      moment(model.value).toDate()
    )
)
const props = defineProps<{
  label?: string
  variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
  density?: 'compact' | 'default' | 'comfortable' | undefined
}>()

const selectedDate = ref<Date>()
const loading = ref(false)
const dialog = ref(false)
const submitSelectHandler = () => {
  model.value = moment(selectedDate.value).format('YYYY-MM-DD')
  dialog.value = false
}
const computedLabel = computed(() => {
  if (props.label === null || props.label === undefined || props.label === '') return '日期选择'
  return props.label
})
</script>
<template>
  <v-text-field
    v-bind="$attrs"
    :label="computedLabel"
    color="indigo"
    class="text-indigo"
    v-model="showModelText"
    :variant="props.variant"
    prepend-inner-icon="mdi-calendar-range"
    readonly
    hide-details
    clearable
    @click="dialog = true"
    @click:clear="model = null"
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-text-field>
  <v-dialog width="500" v-model="dialog">
    <v-card prepend-icon="mdi-calendar-range" title="日期选择">
      <VDatePicker
        width="500"
        color="indigo"
        v-model="selectedDate"
        title="日期选择"
        header="选择日期"
      />
      <v-card-actions class="mx-auto">
        <v-btn color="indigo" :loading="loading" @click="submitSelectHandler" text="确定" />
        <v-btn @click="dialog = false" text="取消" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
