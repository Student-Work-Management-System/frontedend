<script lang="ts" setup>
import type { Role } from '@/api/role'
import { ref } from 'vue'
import { reactive } from 'vue'

const model = defineModel<boolean>()
const emit = defineEmits(['onClosed'])
const props = defineProps<{ roleInfo: { rid: string } }>()

const form = ref(false)
const step = ref(1)

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
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-account-plus" title="新增角色">
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
              text="下一步"
              color="indigo"
              @click="step++"
              variant="plain"
            ></v-btn>
            <v-btn text="取消" @click="model = false" variant="plain"></v-btn>
          </v-container>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
        <v-card title="选择权限" prepend-icon="mdi-cog">
          <v-card-actions class="d-flex justify-space-evenly">
            <v-btn color="indigo">提交</v-btn>
            <v-btn @click="(model = false), (step = 1)">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
