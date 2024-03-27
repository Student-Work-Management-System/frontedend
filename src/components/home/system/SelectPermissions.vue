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
    <v-card width="auto" prepend-icon="mdi-account-plus" title="新增角色">
      <v-container class="px-8 form">
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
      </v-container>
      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn text="新增" color="primary" @click="AddBtnHandler"></v-btn>
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
