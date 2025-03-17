<script lang="ts" setup>
import { apiUpdateUserInfo } from '@/api/user'
import { notify } from '@kyvg/vue3-notification'
import { watchEffect } from 'vue'
import { reactive } from 'vue'
import { ref } from 'vue'
import { type UserRecord } from '@/model/systemModel'

const model = defineModel<boolean>()
const props = defineProps<{ info: UserRecord }>()
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const form = ref(false)
const userInfo = reactive({ uid: '', realName: '', email: '', phone: '', password: '' })
const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateUserInfo({
    ...userInfo
  })
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}

watchEffect(() => {
  userInfo.uid = props.info.uid
  userInfo.realName = props.info.realName
  userInfo.email = props.info.email
  userInfo.phone = props.info.phone
})
</script>

<template>
  <v-dialog v-model="model" width="400">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-pencil" title="修改信息">
      <v-container class="px-8">
        <v-form v-model="form" class="form text-indigo">
          <v-text-field
            label="真实姓名"
            color="indigo"
            v-model="userInfo.realName"
            prepend-inner-icon="mdi-human-greeting"
            :counter="20"
            clearable
            required
            :rules="[() => !!userInfo.realName || '该选项必填！']"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>
          <v-text-field
            prepend-inner-icon="mdi-email"
            label="邮箱"
            color="indigo"
            v-model="userInfo.email"
            :counter="11"
            clearable
            required
            :rules="[() => !!userInfo.email || '该选项必填！']"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>
          <v-text-field
            prepend-inner-icon="mdi-phone"
            label="手机号"
            color="indigo"
            v-model="userInfo.phone"
            clearable
            required
            :rules="[() => !!userInfo.phone || '该选项必填！']"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>
          <v-text-field
            label="密码"
            prepend-inner-icon="mdi-lock"
            color="indigo"
            v-model="userInfo.password"
            class="ml-7"
            :counter="18"
            clearable
          >
          </v-text-field>
        </v-form>
      </v-container>
      <v-divider></v-divider>

      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn
          :disabled="!form"
          text="修改"
          :loading="loading"
          color="indigo"
          variant="plain"
          @click="updateInfoLogic"
        ></v-btn>
        <v-btn text="取消" variant="plain" @click="model = false"></v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
