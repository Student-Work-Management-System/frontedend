<script lang="ts" setup>
import { ref } from 'vue'
import { apiFindBackPassword, apiUpdatePassword } from '@/api/user'
import { notify } from '@kyvg/vue3-notification'

const dialog = defineModel<boolean>()
const loading = ref(false)
const updateForm = ref(false)
const updateModel = ref({
  email: '',
  username: '',
  password: '',
  repassword: '',
  code: ''
})
const step = ref(1)

const findBackPasswordHandler = async () => {
  loading.value = true
  const { data: result } = await apiFindBackPassword(updateModel.value.username)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  updateModel.value.email = result.data.email
  notify({ type: 'success', title: '成功', text: '激活码已通过邮件发送到到相应邮箱' })
  step.value++
  loading.value = false
}

const updatePasswordHandler = async () => {
  loading.value = true
  const { data: result } = await apiUpdatePassword({
    ...updateModel.value
  })
  if (result.code !== 200) {
    loading.value = false
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  notify({ type: 'success', title: '成功', text: '密码修改成功！' })
  step.value = 1
  dialog.value = false
  loading.value = false
}
</script>
<template>
  <v-dialog v-model="dialog" width="500">
    <v-card title="忘记密码" prepend-icon="mdi-lock">
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-container class="px-8">
            <v-text-field label="用户名" v-model="updateModel.username" prepend-inner-icon="mdi-account" :counter="20"
              clearable required :rules="[() => !!updateModel.username || '该选项必填！']">
              <v-tooltip activator="parent" location="top">账户名一般为 教师工号 或 学生学号</v-tooltip>
            </v-text-field>
          </v-container>

          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn :disabled="!(updateModel.username.length > 0)" text="下一步" :loading="loading" color="indigo"
              variant="plain" @click="findBackPasswordHandler"></v-btn>
            <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
          </v-container>
        </v-window-item>
        <v-window-item :value="2">
          <v-container class="px-8">
            <v-form v-model="updateForm">
              <v-alert class="mb-6" text="激活邮件已发送到以下邮箱，请在 5 min 内激活！" title="成功" type="success"></v-alert>
              <v-text-field label="邮箱" prepend-icon="mdi-email" v-model="updateModel.email" disabled></v-text-field>
              <v-text-field label="激活码" prepend-icon="mdi-numeric" v-model="updateModel.code" required
                :rules="[() => !!updateModel.code || '该选项必填！']"></v-text-field>
              <v-text-field label="新密码" prepend-icon="mdi-lock" v-model="updateModel.password" required
                :rules="[() => !!updateModel.password || '该选项必填！']"></v-text-field>
              <v-text-field label="确认密码" prepend-icon="mdi-lock" v-model="updateModel.repassword" required :rules="[
                () => !!updateModel.repassword || '该选项必填！',
                () => updateModel.password === updateModel.repassword || '两次输入密码不相同'
              ]"></v-text-field>
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn :disabled="!updateForm" text="修改" :loading="loading" color="indigo" variant="plain"
              @click="updatePasswordHandler"></v-btn>
            <v-btn text="取消" variant="plain" @click="(step = 1), (dialog = false)"></v-btn>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>
