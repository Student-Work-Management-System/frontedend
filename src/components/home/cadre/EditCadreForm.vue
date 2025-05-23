<script lang="ts" setup>
import { apiUpdateCadre, getCadreLevers } from '@/api/cadre'
import { notify } from '@kyvg/vue3-notification'
import { computed, ref } from 'vue'
import type { Cadre } from '@/model/cadreModel'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const info = defineModel<Cadre>('info')
const modifyInfo = computed(() => {
  return {
    cadreId: info.value!.cadreId,
    cadrePosition: info.value!.cadrePosition,
    cadreBelong: info.value!.cadreBelong,
    cadreLevel: info.value!.cadreLevel
  }
})
const loading = ref(false)
const CadreLevels = getCadreLevers()
const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateCadre(modifyInfo.value)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-content-save-edit-outline" title="职位信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="职位名称"
                v-model="modifyInfo.cadrePosition"
                :counter="20"
                required
                :rules="[() => !!modifyInfo.cadrePosition || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-text-field
                label="所属组织"
                v-model="modifyInfo.cadreBelong"
                required
                :rules="[() => !!modifyInfo.cadreBelong || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-select
                label="职位等级"
                v-model="modifyInfo.cadreLevel"
                :items="CadreLevels"
                :rules="[() => !!modifyInfo.cadreLevel || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-select>
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form"
              text="确定"
              color="indigo"
              @click="updateInfoLogic"
              variant="plain"
            />
            <v-btn text="取消" @click="model = false" variant="plain" />
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>

<style>
.svg-icon {
  margin-right: 0.5rem;
}
</style>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
