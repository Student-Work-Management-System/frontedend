<script lang="ts" setup>
import { apiAddRole } from '@/api/role'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { reactive } from 'vue'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const loading = ref(false)

const newRole = reactive({
  roleName: '',
  roleDesc: ''
})

const AddRoleLogic = async () => {
  loading.value = true
  const { data: result } = await apiAddRole({ ...newRole })
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  loading.value = false
  emits('onClosed')
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-card width="auto" prepend-icon="mdi-account-plus" title="角色信息">
      <v-container>
        <v-form v-model="form" class="px-8 form">
          <v-text-field
            label="角色名称"
            v-model="newRole.roleName"
            :counter="20"
            required
            :rules="[() => !!newRole.roleName || '该选项必填！']"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>
          <v-textarea
            label="角色描述"
            v-model="newRole.roleDesc"
            :counter="255"
            required
            :rules="[() => !!newRole.roleDesc || '该选项必填！']"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-textarea>
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn
          :disabled="!form"
          text="提交"
          color="indigo"
          @click="AddRoleLogic"
          variant="plain"
        ></v-btn>
        <v-btn text="取消" @click="model = false" variant="plain"></v-btn>
      </v-container>
    </v-card>
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
