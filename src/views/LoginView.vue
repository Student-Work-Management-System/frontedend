<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { setAuthorizationToken } from '@/api'
import { apiLogin, userDataCheck } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import ForgetPasswordForm from '@/components/login/ForgetPasswordForm.vue'

interface UserLoginData {
  username: string
  password: string
}

const store = useUserStore()
const router = useRouter()
const route = useRoute()

const userForm = reactive<UserLoginData>({ username: '2100300307', password: '123456' })
const visible = ref(false)
const loadingForm = ref(true)
const remember = ref(true)
const form = ref(false)
const forgetDialog = ref(false)

const loginHandler = async () => {
  loadingForm.value = true
  const { data: result } = await apiLogin(userForm.username, userForm.password)
  if (result.code != 200) {
    notify({ title: '错误', text: result.message, type: 'error' })
    loadingForm.value = false
    return
  }
  store.updateUser(result.data)
  setAuthorizationToken(result.data.token)
  if (remember.value) {
    localStorage.setItem('user-cache', JSON.stringify(result.data))
    localStorage.setItem('user-cache-expired-at', (Date.now() + 7 * 24 * 60 * 60).toString())
  }
  loadingForm.value = false
  notify({ title: '提示', text: '登录成功！', type: 'success' })
  router.push({ name: 'home' })
}

const checkLoginCacheHandler = () => {
  const cacheJson = JSON.parse(localStorage.getItem('user-cache') as string)
  const expiredAt = parseInt(localStorage.getItem('user-cache-expired-at') as string)
  if (cacheJson === null || Date.now() > expiredAt) {
    localStorage.clear()
    setAuthorizationToken('')
    loadingForm.value = false
    return
  }
  try {
    const userData = userDataCheck(cacheJson)
    store.updateUser(userData)
    setAuthorizationToken(userData.token)
    notify({ title: '提示', text: '登录成功！', type: 'success' })
    const to = route.redirectedFrom
    if (to === undefined) router.push({ name: 'home' })
    else router.push(to)
  } catch (error) {
    console.log(error)
    notify({ title: '错误', text: '未知的登录数据', type: 'error' })
    store.cleanStore()
    localStorage.clear()
    setAuthorizationToken('')
  }
  loadingForm.value = false
}
onMounted(checkLoginCacheHandler)
</script>

<template>
  <main class="d-flex justify-center align-center">
    <ForgetPasswordForm v-model="forgetDialog" />
    <v-card
      class="py-8 px-16 d-flex flex-column justify-center align-center"
      elevation="8"
      height="70%"
      width="32%"
    >
      <div class="text-center text-deep-purple-darken-4 mb-2">
        <v-icon icon="mdi-cube" :size="110" />
      </div>
      <h1 class="text-h4 font-weight-bold text-center mb-1 text-deep-purple-darken-4">
        学生信息画像
      </h1>
      <h1 class="text-h4 font-weight-bold text-center text-deep-purple-darken-4">管理系统</h1>
    </v-card>
    <v-card
      :loading="loadingForm"
      :disabled="loadingForm"
      style="
        padding: 6rem 3rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
      "
      elevation="8"
      height="70%"
      width="32%"
    >
      <h1 class="text-h4 text-center text-deep-purple-darken-4 mb-10">用户登录</h1>
      <v-form v-model="form" style="width: 75%">
        <v-text-field
          :loading="loadingForm"
          :counter="15"
          clearable
          density="compact"
          placeholder="输入账户"
          prepend-inner-icon="mdi-account-box"
          variant="outlined"
          v-model="userForm.username"
          required
          :rules="[() => !!userForm.username || '该选项必填！']"
        >
          <v-tooltip activator="parent" location="top">账户名一般为 教师工号 或 学生学号</v-tooltip>
        </v-text-field>

        <v-text-field
          :loading="loadingForm"
          :counter="18"
          clearable
          hide-details
          class="password mt-1"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="输入密码"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="userForm.password"
          required
          :rules="[() => !!userForm.password || '该选项必填！']"
        >
          <v-tooltip activator="parent" location="top"
            >密码为 6-18 位任意数字、字母与常见字符的组合</v-tooltip
          >
        </v-text-field>

        <div class="d-flex align-center justify-space-between">
          <v-checkbox
            v-model="remember"
            class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
            color="indigo"
            label="记住账号"
            hide-details
          ></v-checkbox>
          <v-btn variant="text" color="indigo" @click="forgetDialog = true">忘记密码</v-btn>
        </div>

        <v-btn
          :loading="loadingForm"
          :disabled="!form"
          prepend-icon="mdi-login-variant"
          class="mb-4"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="loginHandler"
          >登 录</v-btn
        >
      </v-form>
    </v-card>
  </main>
</template>

<style scoped>
.threed #spline-canvas {
  border-radius: 2%;
  box-shadow:
    0px 1px 2.2px rgba(0, 0, 0, 0.02),
    0px 2.4px 5.3px rgba(0, 0, 0, 0.028),
    0px 4.5px 10px rgba(0, 0, 0, 0.035),
    0px 8px 17.9px rgba(0, 0, 0, 0.042),
    0px 15px 33.4px rgba(0, 0, 0, 0.05),
    0px 36px 80px rgba(0, 0, 0, 0.07);
}
main {
  height: 100vh;
  width: 100vw;
  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(-160deg, #8eb2e6, #8f6afb, #3e4add);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(-160deg, #8eb2e6, #8f6afb, #3e4add);
}
.v-card {
  border-radius: 0;
}
</style>
