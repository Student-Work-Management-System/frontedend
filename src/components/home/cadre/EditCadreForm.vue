<script lang="ts" setup>
import { apiUpdateCadre, getCadreLevers } from '@/api/cadre'
import { watchEffect } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { reactive } from 'vue'
import type { Cadre } from '@/model/cadreModel'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const props = defineProps<{ info: Cadre }>()
const loading = ref(false)
const cadreInfo = reactive<Cadre>({
  cadreId: '',
  cadrePosition: '',
  cadreLevel: '',
  cadreBelong: ''
})
const CadreLevels = getCadreLevers()
const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateCadre(cadreInfo)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}

watchEffect(() => {
  cadreInfo.cadreId = props.info.cadreId
  cadreInfo.cadrePosition = props.info.cadrePosition
  cadreInfo.cadreLevel = props.info.cadreLevel
  cadreInfo.cadreBelong = props.info.cadreBelong
})
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
                v-model="cadreInfo.cadrePosition"
                :counter="20"
                required
                :rules="[() => !!cadreInfo.cadrePosition || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-text-field
                label="所属组织"
                v-model="cadreInfo.cadreBelong"
                required
                :rules="[() => !!cadreInfo.cadreBelong || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-select
                label="职位等级"
                v-model="cadreInfo.cadreLevel"
                :items="CadreLevels"
                :rules="[() => !!cadreInfo.cadrePosition || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
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
            ></v-btn>
            <v-btn text="取消" @click="model = false" variant="plain"></v-btn>
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
