<script lang="ts" setup>
import { apiAddCadre, getCadreLevers } from '@/api/cadre'
import type { Cadre } from '@/model/cadreModel'
import { notify } from '@kyvg/vue3-notification'
import { ref, reactive } from 'vue'
const emits = defineEmits(['onClosed'])

const CadreLevels = ref<String[]>(getCadreLevers())
const form = ref(false)
const loading = ref(false)
const model = defineModel<boolean>()

const newCadre = reactive<Cadre>({
  cadrePosition: '',
  cadreLevel: '',
  cadreBelong: ''
})

const AddCadreLogic = async () => {
  loading.value = true
  const { data: result } = await apiAddCadre(newCadre as Cadre)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  emits('onClosed')
  clearCadreInfo()
  loading.value = false
}

const clearCadreInfo = () => {
  newCadre.cadrePosition = ''
  newCadre.cadreLevel = ''
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-vector-arrange-below" title="职位信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="职位名称"
                v-model="newCadre.cadrePosition"
                :counter="20"
                required
                :rules="[() => !!newCadre.cadrePosition || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"/>
                </template>
              </v-text-field>
              <v-select
                label="职位等级"
                v-model="newCadre.cadreLevel"
                :items="CadreLevels"
                :rules="[() => !!newCadre.cadrePosition || '该选项必填！']"
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
              @click="AddCadreLogic"
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
