<script lang="ts" setup>
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'

interface userChip {
  username: string
  realName: string
}
const inputChip = ref<userChip>({
  username: '',
  realName: ''
})

const chips = defineModel<userChip[]>()
const show = defineModel<boolean>('show')


const props = withDefaults(
  defineProps<{
    label: string
    class?: string
    variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
  }>(), { label: "主要成员" }
)

const addChipHandler = () => {
  if (inputChip.value.realName.length <= 0 || inputChip.value.username.length <= 0) {
    notify({ type: "warn", title: "提示", text: "学号姓名不能为空！" })
    return
  }
  if (chips.value?.find((e) => e.username === inputChip.value.username)) {
    notify({ type: "warn", title: "提示", text: "学号不能重复！" })
    return
  }
  chips.value?.push({ ...inputChip.value })
}
</script>
<template>
  <section v-if="show" class="d-flex align-center">
    <slot></slot>
    <v-card :class="props.class" variant="tonal">
      <section class="mb-4 pa-2">
        <div style="font-size: 12px;" class="mb-4 ml-1">主要成员：</div>
        <v-row align="center" justify="start">
          <v-col v-for="(chip, i) in chips" :key="chip.username" class="py-1 pe-0" cols="auto">
            <v-chip color="indigo" prepend-icon="mdi-account" closable @click:close="chips?.splice(i, 1)">
              {{ i + 1 + ' | ' + chip.username + chip.realName }}
            </v-chip>
          </v-col>
        </v-row>
      </section>
      <v-divider></v-divider>

      <span class="d-flex">
        <v-text-field label="学号" color="indigo" class="text-indigo" v-model="inputChip.username" clearable hide-details>
        </v-text-field>
        <v-text-field label="姓名" color="indigo" class="text-indigo" v-model="inputChip.realName" clearable hide-details>
        </v-text-field>
      </span>
      <v-btn color="indigo" size="large" variant="tonal" prepend-icon="mdi-plus" block @click="addChipHandler">新 增</v-btn>
    </v-card>
  </section>
</template>
