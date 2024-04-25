<script lang="ts" setup>
import { apiAddCadre ,getCadreLevers} from '@/api/cadre'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { reactive } from 'vue'




const CadreLevels = ref<String[]>(getCadreLevers());


const loading = ref(false)


const newCadre = reactive({
    cadrePosition: '',
    cadreLevel: ''
})

const AddCadreLogic = async () => {
    loading.value = true
    const { data: result } = await apiAddCadre (newCadre)
    if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  emits('onClosed')
  ClearCadreInfo()
  loading.value = false
}

const ClearCadreInfo = ()=>{
    newCadre.cadrePosition = ''
    newCadre.cadreLevel = ''
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window >
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
                    
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
            <v-select
            label="职位等级"
            v-model="newCadre.cadreLevel"
            :items="CadreLevels"
            :rules="[() => !!newCadre.cadrePosition || '该选项必填！']"
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
              @click="AddCadreLogic"
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
