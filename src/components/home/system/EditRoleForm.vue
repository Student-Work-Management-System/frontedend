<script lang="ts" setup>
import type { Role } from '@/api/role'
import { reactive } from 'vue'

const model = defineModel<boolean>()
const emit = defineEmits(['onClosed'])

const newRole = reactive<Role>({
  rid: '',
  roleName: '',
  roleDesc: '',
  permissionList: []
})

const AddBtnHandler = () => {}
const AddRoleLogic = async () => {
  emit('onClosed')
}
</script>

<template>
  <v-dialog width="500" v-model="model">
    <v-card width="auto" prepend-icon="mdi-badge-account" title="权限编辑">
      <v-container class="px-8 form">
        <v-checkbox label="a"> </v-checkbox>
      </v-container>
      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn text="提交" color="primary" @click="AddBtnHandler"></v-btn>
        <v-btn text="取消" @click="model = false"></v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
